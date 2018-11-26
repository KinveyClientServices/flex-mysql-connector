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

if (process.env.NODE_ENV == null) {
  process.env.NODE_ENV = 'test';
}

const proxyquire = require('proxyquire');
const handlersMock = require('../mocks/handlers-mock');
const flexMock = require('../mocks/flex-sdk-mock');
const should = require('should');

describe('flex sdk configuration', () => {
  beforeEach((done) => {
    proxyquire('../../index', { './lib/handlers': handlersMock, 'kinvey-flex-sdk': flexMock });
    setImmediate(done);
  });

  it('should include the directory Service Object', () => {
    (Object.keys(flexMock.serviceObjects)).length.should.eql(1);
    should.exist(flexMock.serviceObjects.directory);
    flexMock.serviceObjects.directory.serviceObjectName.should.eql('directory');
  });

  it('should register a onGetAll Handler', () => {
    should.exist(flexMock.serviceObjects.directory.onGetAll);
    flexMock.serviceObjects.directory.eventMap.onGetAll.should.be.a.Function();
    flexMock.serviceObjects.directory.eventMap.onGetAll.name.should.eql('getAllEmployees');
  });

  it('should register a onGetById Handler', () => {
    should.exist(flexMock.serviceObjects.directory.onGetById);
    flexMock.serviceObjects.directory.eventMap.onGetById.should.be.a.Function();
    flexMock.serviceObjects.directory.eventMap.onGetById.name.should.eql('getOneEmployee');
  });

  it('should register a onGetByCount Handler', () => {
    should.exist(flexMock.serviceObjects.directory.onGetAll);
    flexMock.serviceObjects.directory.eventMap.onGetCount.should.be.a.Function();
    flexMock.serviceObjects.directory.eventMap.onGetCount.name.should.eql('countEmployees');
  });
});
