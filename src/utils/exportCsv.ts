import { Response } from "express";
import { stringify } from "csv-stringify/sync";

export function exportCsv(
  response: Response,
  data: Record<string, unknown>[],
  fileName: string
) {
  const csv = stringify(data, {
    header: true,
  });

  response.header("Content-Type", "text/csv; charset=utf-8");
  response.attachment(fileName);

  return response.send(csv);
}