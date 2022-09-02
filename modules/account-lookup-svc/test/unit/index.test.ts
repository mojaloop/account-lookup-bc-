/**
 License
 --------------
 Copyright © 2021 Mojaloop Foundation

 The Mojaloop files are made available by the Mojaloop Foundation under the Apache License, Version 2.0 (the "License") and you may not use these files except in compliance with the License.

 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, the Mojaloop files are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

 Contributors
 --------------
 This is the official list (alphabetical ordering) of the Mojaloop project contributors for this file.
 Names of the original copyright holders (individuals or organizations)
 should be listed with a '' in the first column. People who have
 contributed from an organization can be listed under the organization
 that actually holds the copyright for their contributions (see the
 Gates Foundation organization for an example). Those individuals should have
 their names indented and be marked with a '-'. Email address can be added
 optionally within square brackets <email>.

 * Gates Foundation
 - Name Surname <name.surname@gatesfoundation.com>

 * Coil
 - Jason Bruwer <jason.bruwer@coil.com>

 * Crosslake
 - Pedro Sousa Barreto <pedrob@crosslaketech.com>

 * Gonçalo Garcia <goncalogarcia99@gmail.com>
 
 * Arg Software
 - José Antunes <jose.antunes@arg.software>
 - Rui Rocha <rui.rocha@arg.software>

 --------------
 **/

import {AccountLookupAggregate, IOracleFinder, IOracleProvider} from "@mojaloop/account-lookup-bc-domain";
import { mockedOracleList } from "@mojaloop/account-lookup-bc-domain/test/unit/mocks/data";
import { MemoryOracleFinder } from "@mojaloop/account-lookup-bc-domain/test/unit/mocks/memory_oracle_finder";
import { MemoryOracleProvider } from "@mojaloop/account-lookup-bc-domain/test/unit/mocks/memory_oracle_providers";
import { ConsoleLogger, ILogger, LogLevel } from "@mojaloop/logging-bc-public-types-lib";
import { IAccountLookUpEventHandler, AccountLookUpEventHandler } from "../../src/modules/event_handler";
import { AccountLookUpEventsType, IAccountLookUpMessage } from "../../src/types";


const logger: ILogger = new ConsoleLogger();
logger.setLogLevel(LogLevel.FATAL);

const oracleFinder: IOracleFinder = new MemoryOracleFinder(
    logger,
);
const oracleProviderList: IOracleProvider[] = [];

for(let i=0 ; i<mockedOracleList.length ; i+=1) {
    const oracleProvider: IOracleProvider = new MemoryOracleProvider(
        logger,
    );
    oracleProvider.id = mockedOracleList[i].id;
    oracleProviderList.push(oracleProvider);
}

const mockedAggregate: AccountLookupAggregate = new AccountLookupAggregate(
    logger,
    oracleFinder,
    oracleProviderList
);

const eventHandler: IAccountLookUpEventHandler = new AccountLookUpEventHandler(logger, mockedAggregate);

 describe("Account Lookup Service", () => {

    afterEach(async () => {
        jest.clearAllMocks();
    });


    test("should add all events for account lookup when init is called", async()=>{
        // Arrange
        const eventNames = Object.values(AccountLookUpEventsType);

        // Act
        eventHandler.init();

        // Assert
        expect(eventHandler.get().eventNames()).toEqual(eventNames);

    });

    test("should log error if message is on a invalid format", async()=>{
        // Arrange
        const invalidMessage:any = {
            type: "invalid",
        };
        jest.spyOn(logger, "error").mockImplementationOnce(() => { });
        
        // Act
        eventHandler.publishAccountLookUpEvent(invalidMessage);

        // Assert
        expect(logger.error).toBeCalledWith(`AccountLookUpServiceEventHandler: publishAccountLookUpEvent: message as an invalid format or value`);
        
    });

    test("should log error if message has invalid type", async()=>{
        // Arrange
        const invalidMessage:any = {
            value: {
                type:"invalid type",
                payload: {"test":"test"}
            }
        };
        jest.spyOn(logger, "error").mockImplementationOnce(() => { });
        
        // Act
        eventHandler.publishAccountLookUpEvent(invalidMessage);

        // Assert
        expect(logger.error).toBeCalledWith(`AccountLookUpServiceEventHandler: publishAccountLookUpEvent: message type ${invalidMessage.value.type} is not a valid event type`);
        
    });

    test("should call getPartyByTypeAndId aggregate method for GetPartyByTypeAndId Event", async()=>{
        // Arrange
        const fakePayload = { partyType:"1", partyId: "2" };
        const message:IAccountLookUpMessage = {
            key: "account-lookup-service",
            timestamp: 12,
            topic: "account-lookup-service",
            headers: [],
            value: {
                type:AccountLookUpEventsType.GetPartyByTypeAndId,
                payload: fakePayload
            }
        };
        
        jest.spyOn(mockedAggregate, "getPartyByTypeAndId").mockResolvedValueOnce({} as any);
        
        // Act
        eventHandler.publishAccountLookUpEvent(message);

        // Assert
       expect(mockedAggregate.getPartyByTypeAndId).toBeCalledWith(fakePayload.partyType, fakePayload.partyId);
        
    });

    test("should log error if getPartyByTypeAndId aggregate method for GetPartyByTypeAndId Event throws error", async()=>{
        // Arrange
        const fakePayload = { partyType:"1", partyId: "2" };
        const message:IAccountLookUpMessage = {
            key: "account-lookup-service",
            timestamp: 12,
            topic: "account-lookup-service",
            headers: [],
            value: {
                type:AccountLookUpEventsType.GetPartyByTypeAndId,
                payload: fakePayload
            }
        };
        const errorMessage = "execution error";
        
        jest.spyOn(mockedAggregate, "getPartyByTypeAndId").mockRejectedValueOnce(errorMessage);
        jest.spyOn(logger, "error").mockImplementationOnce(() => { });
        
        // Act
        await Promise.resolve(eventHandler.publishAccountLookUpEvent(message));

        // Assert
        expect(logger.error).toBeCalledWith(`${AccountLookUpEventsType.GetPartyByTypeAndId}: ${errorMessage}`);
        
    });

    test("should call getPartyByTypeAndIdAndSubId aggregate method for GetPartyByTypeAndIdAndSubId Event", async()=>{
        // Arrange
        const fakePayload = { partyType:"1", partyId: "2", partySubId:"3" };
        const message:IAccountLookUpMessage = {
            key: "account-lookup-service",
            timestamp: 12,
            topic: "account-lookup-service",
            headers: [],
            value: {
                type:AccountLookUpEventsType.GetPartyByTypeAndIdAndSubId,
                payload: fakePayload
            }
        };
        
        jest.spyOn(mockedAggregate, "getPartyByTypeAndIdAndSubId").mockResolvedValueOnce({} as any);
        
        // Act
        eventHandler.publishAccountLookUpEvent(message);

        // Assert
       expect(mockedAggregate.getPartyByTypeAndIdAndSubId).toBeCalledWith(fakePayload.partyType, fakePayload.partyId, fakePayload.partySubId);
        
    });

    test("should log error if getPartyByTypeAndIdAndSubId aggregate method for GetPartyByTypeAndIdAndSubId Event throws error", async()=>{
        // Arrange
        const fakePayload = { partyType:"1", partyId: "2", partySubId:"3" };
        const message:IAccountLookUpMessage = {
            key: "account-lookup-service",
            timestamp: 12,
            topic: "account-lookup-service",
            headers: [],
            value: {
                type:AccountLookUpEventsType.GetPartyByTypeAndIdAndSubId,
                payload: fakePayload
            }
        };
        const errorMessage = "execution error";
        
        jest.spyOn(mockedAggregate, "getPartyByTypeAndIdAndSubId").mockRejectedValueOnce(errorMessage);
        jest.spyOn(logger, "error").mockImplementationOnce(() => { });
        
        // Act
        await Promise.resolve(eventHandler.publishAccountLookUpEvent(message));

        // Assert
        expect(logger.error).toBeCalledWith(`${AccountLookUpEventsType.GetPartyByTypeAndIdAndSubId}: ${errorMessage}`);
        
    });

    test("should call associatePartyByTypeAndId aggregate method for AssociatePartyByTypeAndId Event", async()=>{
        // Arrange
        const fakePayload = { partyType:"1", partyId: "2" };
        const message:IAccountLookUpMessage = {
            key: "account-lookup-service",
            timestamp: 12,
            topic: "account-lookup-service",
            headers: [],
            value: {
                type:AccountLookUpEventsType.AssociatePartyByTypeAndId,
                payload: fakePayload
            }
        };
        
        jest.spyOn(mockedAggregate, "associatePartyByTypeAndId").mockResolvedValueOnce({} as any);
        
        // Act
        eventHandler.publishAccountLookUpEvent(message);

        // Assert
       expect(mockedAggregate.associatePartyByTypeAndId).toBeCalledWith(fakePayload.partyType, fakePayload.partyId);
        
    });

    test("should log error if associatePartyByTypeAndId aggregate method for AssociatePartyByTypeAndId Event throws error", async()=>{
        // Arrange
        const fakePayload = { partyType:"1", partyId: "2" };
        const message:IAccountLookUpMessage = {
            key: "account-lookup-service",
            timestamp: 12,
            topic: "account-lookup-service",
            headers: [],
            value: {
                type:AccountLookUpEventsType.AssociatePartyByTypeAndId,
                payload: fakePayload
            }
        };
        const errorMessage = "execution error";
        
        jest.spyOn(mockedAggregate, "associatePartyByTypeAndId").mockRejectedValueOnce(errorMessage);
        jest.spyOn(logger, "error").mockImplementationOnce(() => { });
        
        // Act
        await Promise.resolve(eventHandler.publishAccountLookUpEvent(message));

        // Assert
        expect(logger.error).toBeCalledWith(`${AccountLookUpEventsType.AssociatePartyByTypeAndId}: ${errorMessage}`);
        
    });

    test("should call associatePartyByTypeAndIdAndSubId aggregate method for AssociatePartyByTypeAndIdAndSubId Event", async()=>{
        // Arrange
        const fakePayload = { partyType:"1", partyId: "2", partySubId:"3" };
        const message:IAccountLookUpMessage = {
            key: "account-lookup-service",
            timestamp: 12,
            topic: "account-lookup-service",
            headers: [],
            value: {
                type:AccountLookUpEventsType.AssociatePartyByTypeAndIdAndSubId,
                payload: fakePayload
            }
        };
        
        jest.spyOn(mockedAggregate, "associatePartyByTypeAndIdAndSubId").mockResolvedValueOnce({} as any);
        
        // Act
        eventHandler.publishAccountLookUpEvent(message);

        // Assert
       expect(mockedAggregate.associatePartyByTypeAndIdAndSubId).toBeCalledWith(fakePayload.partyType, fakePayload.partyId, fakePayload.partySubId);
        
    });

    test("should log error if getPartyByTypeAndIdAndSubId aggregate method for GetPartyByTypeAndIdAndSubId Event throws error", async()=>{
        // Arrange
        const fakePayload = { partyType:"1", partyId: "2", partySubId:"3" };
        const message:IAccountLookUpMessage = {
            key: "account-lookup-service",
            timestamp: 12,
            topic: "account-lookup-service",
            headers: [],
            value: {
                type:AccountLookUpEventsType.GetPartyByTypeAndIdAndSubId,
                payload: fakePayload
            }
        };
        const errorMessage = "execution error";
        
        jest.spyOn(mockedAggregate, "getPartyByTypeAndIdAndSubId").mockRejectedValueOnce(errorMessage);
        jest.spyOn(logger, "error").mockImplementationOnce(() => { });
        
        // Act
        await Promise.resolve(eventHandler.publishAccountLookUpEvent(message));

        // Assert
        expect(logger.error).toBeCalledWith(`${AccountLookUpEventsType.GetPartyByTypeAndIdAndSubId}: ${errorMessage}`);
        
    });

    test("should call disassociatePartyByTypeAndId aggregate method for DisassociatePartyByTypeAndId Event", async()=>{
        // Arrange
        const fakePayload = { partyType:"1", partyId: "2" };
        const message:IAccountLookUpMessage = {
            key: "account-lookup-service",
            timestamp: 12,
            topic: "account-lookup-service",
            headers: [],
            value: {
                type:AccountLookUpEventsType.DisassociatePartyByTypeAndId,
                payload: fakePayload
            }
        };
        
        jest.spyOn(mockedAggregate, "disassociatePartyByTypeAndId").mockResolvedValueOnce({} as any);
        
        // Act
        eventHandler.publishAccountLookUpEvent(message);

        // Assert
       expect(mockedAggregate.disassociatePartyByTypeAndId).toBeCalledWith(fakePayload.partyType, fakePayload.partyId);
        
    });

    test("should log error if disassociatePartyByTypeAndId aggregate method for DisassociatePartyByTypeAndId Event throws error", async()=>{
        // Arrange
        const fakePayload = { partyType:"1", partyId: "2" };
        const message:IAccountLookUpMessage = {
            key: "account-lookup-service",
            timestamp: 12,
            topic: "account-lookup-service",
            headers: [],
            value: {
                type:AccountLookUpEventsType.DisassociatePartyByTypeAndId,
                payload: fakePayload
            }
        };
        const errorMessage = "execution error";
        
        jest.spyOn(mockedAggregate, "disassociatePartyByTypeAndId").mockRejectedValueOnce(errorMessage);
        jest.spyOn(logger, "error").mockImplementationOnce(() => { });
        
        // Act
        await Promise.resolve(eventHandler.publishAccountLookUpEvent(message));

        // Assert
        expect(logger.error).toBeCalledWith(`${AccountLookUpEventsType.DisassociatePartyByTypeAndId}: ${errorMessage}`);
        
    });

    test("should call disassociatePartyByTypeAndIdAndSubId aggregate method for DisassociatePartyByTypeAndIdAndSubId Event", async()=>{
        // Arrange
        const fakePayload = { partyType:"1", partyId: "2", partySubId:"3" };
        const message:IAccountLookUpMessage = {
            key: "account-lookup-service",
            timestamp: 12,
            topic: "account-lookup-service",
            headers: [],
            value: {
                type:AccountLookUpEventsType.DisassociatePartyByTypeAndIdAndSubId,
                payload: fakePayload
            }
        };
        
        jest.spyOn(mockedAggregate, "disassociatePartyByTypeAndIdAndSubId").mockResolvedValueOnce({} as any);
        
        // Act
        eventHandler.publishAccountLookUpEvent(message);

        // Assert
       expect(mockedAggregate.disassociatePartyByTypeAndIdAndSubId).toBeCalledWith(fakePayload.partyType, fakePayload.partyId, fakePayload.partySubId);
        
    });

    test("should log error if disassociatePartyByTypeAndIdAndSubId aggregate method for DisassociatePartyByTypeAndIdAndSubId Event throws error", async()=>{
        // Arrange
        const fakePayload = { partyType:"1", partyId: "2", partySubId:"3" };
        const message:IAccountLookUpMessage = {
            key: "account-lookup-service",
            timestamp: 12,
            topic: "account-lookup-service",
            headers: [],
            value: {
                type:AccountLookUpEventsType.DisassociatePartyByTypeAndIdAndSubId,
                payload: fakePayload
            }
        };
        const errorMessage = "execution error";
        
        jest.spyOn(mockedAggregate, "disassociatePartyByTypeAndIdAndSubId").mockRejectedValueOnce(errorMessage);
        jest.spyOn(logger, "error").mockImplementationOnce(() => { });
        
        // Act
        await Promise.resolve(eventHandler.publishAccountLookUpEvent(message));

        // Assert
        expect(logger.error).toBeCalledWith(`${AccountLookUpEventsType.DisassociatePartyByTypeAndIdAndSubId}: ${errorMessage}`);
        
    });


    test("should remove all events for account lookup when destroy is called", async()=>{
        // Arrange
        const eventNames = Object.values(AccountLookUpEventsType);
        
        // Act
        eventHandler.destroy();

        // Assert
        eventNames.forEach(eventName => {
            expect(eventHandler.get().listenerCount(eventName)).toBe(0);
        });
        expect(eventHandler.get().eventNames().length).toEqual(0);
        
    });

 });