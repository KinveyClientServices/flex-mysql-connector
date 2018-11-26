/**
 * Copyright (c) 2017 Kinvey Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

const config = require('config');
const mysql = require('mysql');

class MySqlConnection {
  constructor(username, password, connectionString) {
    this.pool = mysql.createPool(config.mysql);
  }

  _runQuery(query, callback) {
    this.pool.query(query, callback);
  }

  getByField(table, field, value, callback) {
    this._runQuery(`SELECT * from ${table} WHERE ${field} = ${value}`, callback);
  }

  getTable(table, callback) {
    this._runQuery(`SELECT * from ${table}`, callback);
  }

  getTableCount(table, callback) {
    this._runQuery(`SELECT count(*) "count" from ${table}`, callback);
  }

  insertRecord(table, doc, callback) {
    this.pool.query('INSERT INTO ?? set ?', [table, doc], callback);
  }
}

module.exports = MySqlConnection;