import { Options } from 'tsup'

export function getConfig(options: Options): Options {
  if (!options.entry?.length) throw new Error('entry is required')
  return {
    bundle: true,
    clean: true,
    dts: true,
    format: ['esm'],
    splitting: true,
    target: 'es2021',
    ...options,
  }
}
