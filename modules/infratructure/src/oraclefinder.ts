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

import {ILogger} from "@mojaloop/logging-bc-public-types-lib";
import {MongoClient, Collection} from "mongodb";
import {
    IOracleFinder,
	UnableToInitOracleFinderError,
	UnableToGetOracleError
} from "@mojaloop/account-lookup-bc-domain";

export class MongoOracleFinderRepo implements IOracleFinder{
	// Properties received through the constructor.
	private readonly logger: ILogger;
	private readonly DB_URL: string;
	private readonly DB_NAME: string;
	private readonly COLLECTION_NAME: string;
	// Other properties.
	private readonly mongoClient: MongoClient;
	private oracleProviders: Collection;

	constructor(
		logger: ILogger,
		DB_URL: string,
		DB_NAME: string,
		COLLECTION_NAME: string
	) {
		this.logger = logger;
		this.DB_URL = DB_URL;
		this.DB_NAME = DB_NAME;
		this.COLLECTION_NAME = COLLECTION_NAME;

		this.mongoClient = new MongoClient(this.DB_URL);
	}

	async init(): Promise<void> {
		try {
			await this.mongoClient.connect();
		} catch (e: unknown) {
			throw new UnableToInitOracleFinderError((e as any)?.message);
		}
		
		this.oracleProviders = this.mongoClient.db(this.DB_NAME).collection(this.COLLECTION_NAME);
	}

	async destroy(): Promise<void> {
		await this.mongoClient.close(); // Doesn't throw if the repo is unreachable.
	}

    async getOracleForType(type: String): Promise<String | undefined> {
		try {
			const foundOracle: any = await this.oracleProviders.findOne(
				{type: type},
			);

			return foundOracle.id;
		} catch (e: unknown) {
			throw new UnableToGetOracleError();
		}
    }
}
