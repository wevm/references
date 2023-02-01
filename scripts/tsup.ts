import dedent from 'dedent'
import { execa } from 'execa'
import { default as fs } from 'fs-extra'
import type { Format, Options } from 'tsup'

import path from 'path'

type GetConfig = Omit<
  Options,
  'bundle' | 'clean' | 'dts' | 'entry' | 'format'
> & {
  entry?: string[]
  dev?: boolean
}

export function getConfig({ dev, ...options }: GetConfig): Options {
  if (!options.entry?.length) throw new Error('entry is required')
  const entry: string[] = options.entry ?? []

  const packageJson = fs.readJsonSync('package.json')
  let format: Format[] = ['cjs']
  if (packageJson.type === 'module') format = ['esm']
  if (packageJson.module) format.push('esm')
  if (process.env.FORMAT as Format) format = [process.env.FORMAT as Format]

  // Hacks tsup to create Preconstruct-like linked packages for development
  // https://github.com/preconstruct/preconstruct
  if (dev)
    return {
      clean: true,
      // Only need to generate one file with tsup for development since we will create links in `onSuccess`
      entry: [entry[0] as string],
      format,
      silent: true,
      async onSuccess() {
        // remove all files in dist
        await fs.emptyDir('dist')
        // symlink files and type definitions
        for (const file of entry) {
          const filePath = path.resolve(file)
          const distSourceFile = filePath
            .replace(file, file.replace('src/', 'dist/'))
            .replace(/\.ts$/, '.js')
          // Make sure directory exists
          await fs.ensureDir(path.dirname(distSourceFile))
          // Create symlink between source and dist file
          await fs.symlink(filePath, distSourceFile, 'file')
          // Create file linking up type definitions
          const srcTypesFile = path
            .relative(path.dirname(distSourceFile), filePath)
            .replace(/\.ts$/, '')
          await fs.outputFile(
            distSourceFile.replace(/\.js$/, '.d.ts'),
            `export * from '${srcTypesFile}'`,
          )
          if (format.includes('esm') && format.includes('cjs'))
            fs.copyFileSync(
              distSourceFile,
              distSourceFile.replace('.js', '.mjs'),
            )
        }
        const exports = await generateExports(entry, { format })
        await generateProxyPackages(exports, { format })
        if (format.includes('esm')) await validateExports(exports)
      },
    }

  return {
    bundle: true,
    clean: true,
    dts: true,
    format,
    splitting: true,
    target: 'es2021',
    async onSuccess() {
      if (typeof options.onSuccess === 'function') await options.onSuccess()
      else if (typeof options.onSuccess === 'string') execa(options.onSuccess)

      const exports = await generateExports(entry, { format })
      await generateProxyPackages(exports, { format })

      if (!format.includes('esm')) return
      try {
        await validateExports(exports)
      } catch (error) {
        // `onSuccess` can run before type definitions are created so check again if failure
        // https://github.com/egoist/tsup/issues/700
        if (
          (error as Error).message.includes(
            'File does not exist for export "types"',
          )
        ) {
          await new Promise((resolve) =>
            setTimeout(async () => {
              await validateExports(exports)
              resolve(true)
            }, 7_500),
          )
        } else throw error
      }
    },
    ...options,
  }
}

type Exports = {
  [key: string]: string | { types?: string; module?: string; default: string }
}

/**
 * Generate exports from entry files
 */
async function generateExports(
  entry: string[],
  { format }: { format?: Format[] },
) {
  const exports: Exports = {}
  for (const file of entry) {
    const extension = path.extname(file)
    const fileWithoutExtension = file.replace(extension, '')
    const name = fileWithoutExtension
      .replace(/^src\//g, './')
      .replace(/\/index$/, '')
    const distSourceFile = `${fileWithoutExtension.replace(
      /^src\//g,
      './dist/',
    )}.js`
    const distTypesFile = `${fileWithoutExtension.replace(
      /^src\//g,
      './dist/',
    )}.d.ts`
    if (format?.includes('cjs')) {
      exports[name] = {
        types: distTypesFile,
        module: distSourceFile.replace('.js', '.mjs'),
        default: distSourceFile,
      }
    } else {
      exports[name] = {
        types: distTypesFile,
        default: distSourceFile,
      }
    }
  }

  exports['./package.json'] = './package.json'

  const packageJson = await fs.readJSON('package.json')
  packageJson.exports = exports
  await fs.writeFile(
    'package.json',
    JSON.stringify(packageJson, null, 2) + '\n',
  )

  return exports
}

/**
 * Validate exports point to actual files
 */
async function validateExports(exports: Exports) {
  for (const [key, value] of Object.entries(exports)) {
    if (typeof value === 'string') continue
    for (const [type, path] of Object.entries(value)) {
      const fileExists = await fs.pathExists(path)
      if (!fileExists)
        throw new Error(
          `File does not exist for export "${type}": "${value.default}" in "${key}."`,
        )
    }
  }
}

/**
 * Generate proxy packages files for each export
 */
async function generateProxyPackages(
  exports: Exports,
  { format }: { format?: Format[] },
) {
  const ignorePaths = []
  const files = new Set<string>()
  for (const [key, value] of Object.entries(exports)) {
    if (typeof value === 'string') continue
    if (key === '.') continue
    if (!value.default) continue
    await fs.ensureDir(key)
    const entrypoint = path.relative(key, value.default)
    const fileExists = await fs.pathExists(value.default)
    if (!fileExists)
      throw new Error(
        `Proxy package "${key}" entrypoint "${entrypoint}" does not exist.`,
      )

    if (format?.includes('cjs')) {
      await fs.outputFile(
        `${key}/package.json`,
        dedent`{
            "module": "${entrypoint.replace('.js', '.mjs')}",
            "main": "${entrypoint}"
          }`,
      )
    } else {
      await fs.outputFile(
        `${key}/package.json`,
        dedent`{
            "type": "module",
            "main": "${entrypoint}"
          }`,
      )
    }
    ignorePaths.push(key.replace(/^\.\//g, ''))

    const file = key.replace(/^\.\//g, '').split('/')[0]
    if (!file || files.has(file)) continue
    files.add(`/${file}`)
  }

  files.add('/dist')
  const packageJson = await fs.readJSON('package.json')
  packageJson.files = [...files.values()]
  await fs.writeFile(
    'package.json',
    JSON.stringify(packageJson, null, 2) + '\n',
  )

  if (ignorePaths.length === 0) return
  await fs.outputFile(
    '.gitignore',
    dedent`
    # Generated file. Do not edit directly.
    ${ignorePaths.join('/**\n')}/**
  `,
  )
}
