import { PoolConfig, Pool, PoolClient } from "pg";
import format from "pg-format";
import { ApiError } from "../common";
import { StatusCodes } from "http-status-codes";

export class PgReader {
  private pool: Pool;

  constructor(connectionJson: PoolConfig) {
    this.pool = new Pool(connectionJson);
  }

  async connect(): Promise<PoolClient> {
    return await this.pool.connect();
  }
  
  async query(sql: string, multi: boolean, params?: any[]): Promise<any[]> {
      const client = await this.connect();
      try {
        if (!multi) {
          const result = await client.query(sql, params).then(x => { return x });
          return result.rows;
        } else {
          const result = await client.query(format(sql, params)).then(x => { return x });
          return result.rows;
        }
      } catch (err) {
        console.error(err);
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Error with query");
      } finally {
        client.release();      
      }    
  }
}

export const pgDatabase = new PgReader({
  user: "postgres",
  host: "10.16.0.144",
  database: "postgres",
  password: "P@ssw0rd",
  port: 5432
});
