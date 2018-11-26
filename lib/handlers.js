/**
 * Copyright (c) 2016 Kinvey Inc.
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

const MySqlClient = require('./mysql-client');
const transformers = require('./transformers');

const EMPLOYEE_DIRECTORY = 'EmployeeDirectory';
const EMPLOYEE_DIRECTORY_ID_FIELD = 'employeeId';
let client;

/* This module contains the handlers for each flex data method.  Each handler:
 * 1) Makes a request to an external service via a client
 * 2) Transforms the result, if necessary
 * 3) Returns the result via the completion handler
 */

function getClient() {
  if (client == null) {
    client = new MySqlClient();
  }
  return client;
}

function getAllEmployees(context, complete, modules) {
  getClient().getTable(EMPLOYEE_DIRECTORY, (err, result) => {
    if (err) {
      return complete().setBody(err).runtimeError().done();
    }
    return transformers.transformArray(result, modules, (err, transformedResult) => complete().setBody(transformedResult).ok().next());
  });
}

function getOneEmployee(context, complete, modules) {
  getClient().getByField(EMPLOYEE_DIRECTORY, EMPLOYEE_DIRECTORY_ID_FIELD, context.entityId, (err, result) => {
    if (err) {
      return complete().setBody(err).runtimeError().done();
    } else if (err == null && result === undefined) {
      return complete().notFound().done();
    }
    return complete().setBody(transformers.transformEntity(result[0], modules)).ok().next();
  });
}

function countEmployees(context, complete) {
  getClient().getTableCount(EMPLOYEE_DIRECTORY, (err, result) => {
    if (err) {
      return complete().setBody(err).runtimeError().done();
    }
    console.log(result);
    return complete().setBody(transformers.transformCount(result)).ok().next();
  });
}

function insertEmployee(context, complete, modules) {
  const recordToInsert = transformers.transformForWrite(context.body);
  getClient().insertRecord(EMPLOYEE_DIRECTORY, recordToInsert, (err, result) => {
    if (err) {
      return complete().setBody(err).runtimeError().done();
    }
    recordToInsert.employeeId = result.insertId;
    return complete().setBody(transformers.transformEntity(recordToInsert, modules)).ok().next();
  });
}

module.exports = {
  getOneEmployee,
  getAllEmployees,
  countEmployees,
  insertEmployee
};
