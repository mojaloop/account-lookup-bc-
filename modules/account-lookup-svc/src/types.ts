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

 "use strict";

import {IMessage} from "@mojaloop/platform-shared-lib-messaging-types-lib";

export enum AccountLookUpEventsType  {
    GetPartyByTypeAndId = "[Account Lookup] Get Party By Type And Id",
    GetPartyByTypeAndIdAndSubId ="[Account Lookup] Get Party By Type And Id And SubId",
    AssociatePartyByTypeAndId = "[Account Lookup]  Associate Party By Type And Id",
    AssociatePartyByTypeAndIdAndSubId = "[Account Lookup]  Associate Party By Type And Id And SubId",
    DisassociatePartyByTypeAndId = "[Account Lookup]  Disassociate Party By Type And Id",
    DisassociatePartyByTypeAndIdAndSubId= "[Account Lookup]  Disassociate Party By Type And Id And SubId"
}

export interface IAccountLookUpMessage extends IMessage {
    value: {
        type:AccountLookUpEventsType,
        payload: object
    }
}