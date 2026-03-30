import * as XLSX from 'xlsx'

export class ExcelReader {
  constructor(private file: File) {}

  async read<T>(sheetName: string): Promise<T[]> {
    const data = await this.file.arrayBuffer()
    const workbook = XLSX.read(data, { type: 'array' })
    const worksheet = workbook.Sheets[sheetName]
    if (!worksheet) {
      throw new Error(`Sheet "${sheetName}" not found in the Excel file.`)
    }
    return XLSX.utils.sheet_to_json<T>(worksheet)
  }
}
