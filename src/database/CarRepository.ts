import { executeTransaction } from "./SQLiteDatabase";

export type Car = {
  id?: number;
  brand: string;
  model: string;
  hp: number;
};

export default class CarRepository {
  constructor() {
    this.up();
  }

  public async up() {
    await executeTransaction(
      "CREATE TABLE IF NOT EXISTS cars (id INTEGER PRIMARY KEY AUTOINCREMENT, brand TEXT, model TEXT, hp INT);",
    );
  }

  public async down() {
    await executeTransaction("DROP TABLE cars;");
  }

  public async create(car: Car) {
    const result = await executeTransaction(
      "INSERT INTO cars (brand, model, hp) values (?, ?, ?);",
      [car.brand, car.model, car.hp],
    );
    return result.insertId;
  }

  public async all() {
    const result = await executeTransaction("SELECT * FROM cars");
    return result.rows._array;
  }

  public async delete(id: number) {
    const result = await executeTransaction("DELETE FROM cars WHERE id=?;", [
      id,
    ]);
    return result.rowsAffected;
  }

  public async update(id: number, car: Car) {
    const result = await executeTransaction(
      "UPDATE cars SET brand=?, model=?, hp=? WHERE id=?;",
      [car.brand, car.model, car.hp, id],
    );
    return result.rowsAffected;
  }

  public async findByModel(model: string) {
    const result = await executeTransaction(
      "SELECT * FROM cars WHERE model LIKE ?;",
      [`%${model}%`],
    );
    return result.rows._array;
  }

  public async findHpBetween(min: number, max: number) {
    const result = await executeTransaction(
      "SELECT * FROM cars WHERE hp BETWEEN ? AND ?;",
      [min, max],
    );
    return result.rows._array;
  }
}
