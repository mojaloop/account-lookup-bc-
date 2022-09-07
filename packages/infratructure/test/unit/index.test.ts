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

import { ILocalCache } from "@mojaloop/account-lookup-bc-domain";
import { LocalCache } from "./../../src/localcache";

 let localCache: ILocalCache<number>;

 describe("Infrastructure", () => {
    

    test("should create a new local cache instance", async()=>{ 
        
        //Arrange && Act 
        localCache = new LocalCache<number>();
        localCache.set("key", 1);
        
        //Assert
        expect(localCache).toBeDefined();
        expect(localCache.get("key")).toBe(1);
    });

    test("should return null if time to live for the specific entry is surpassed", async()=>{ 
        
        //Arrange 
        localCache = new LocalCache<number>(1);
        localCache.set("key", 1);
        await new Promise(resolve => setTimeout(resolve, 2000));

        //Act
        const result = localCache.get("key");

        //Assert
        expect(result).toBeNull();
    });

    test("should return value if time to live for the specific entry is not surpassed", async()=>{ 
        
        //Arrange 
        localCache = new LocalCache<number>(10);
        localCache.set("key", 1);
        await new Promise(resolve => setTimeout(resolve, 2000));

        //Act
        const result = localCache.get("key");

        //Assert
        expect(result).toBe(1);
    });

    test("should return null if no key is present", async()=>{ 
        
        //Arrange 
        localCache = new LocalCache<number>();
        localCache.set("key", 1);
        
        //Act
        const result = localCache.get("InvalidKey");

        //Assert
        expect(result).toBeNull();
    });

    test("should clear cache", async()=>{ 
        
        //Arrange 
        localCache = new LocalCache<number>();
        localCache.set("key", 1);
        localCache.destroy();
        
        //Act
        const result = localCache.get("key");

        //Assert
        expect(result).toBeNull();
    });

});

