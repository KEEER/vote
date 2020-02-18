import { query } from '../../common/graphql'

export const updateSetting = async (name, value) => {
  const res = await query(`
    mutation UpdateSettings($name: String!, $value: String) {
      updateSettings(name: $name, value: $value)
    }`.trim(), { name, value: JSON.stringify(value) })
  if (res.errors || !res.data.updateSettings) throw res
}
