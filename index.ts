import synchronizer from "synchronizer-v2";
import { ethers } from "ethers";
import { abi } from "./supply-uni-abi";
import dotenv from "dotenv";

dotenv.config();

const { APP_DNS, NODE_URL } = process.env;

(async () => {
  if (`${APP_DNS}` == "") {
    throw new Error("the dns of your server is required");
  }

  if (`${NODE_URL}` == "") {
    throw new Error("the node provider url is required");
  }

  console.log(APP_DNS);
  console.log(NODE_URL);

  // New Synchronizer instance
  const sync = new synchronizer(`${APP_DNS}`);

  // All events
  const events = await sync.GetEvents();
  console.log("All events: ", events);

  //   // Address and event name from one of the configured events
  const address = "0xC9Fc250Ab92a802fCc96719eBE17c9c831aDF264";
  const eventName = "Deposit";

  // All events of a given address
  const eventsByAddress = await sync.GetEventsByAddress(address);
  console.log("eventsByAddress: ", eventsByAddress);

  // Event insertion
  const network = "polygon";
  // Get the node provider
  const provider = new ethers.JsonRpcProvider(NODE_URL);

  // Get an ethers instance of the contract
  const parsedAbi = JSON.stringify(abi);
  const contract = new ethers.BaseContract(address, parsedAbi, provider);

  // Interact with the api for inseting an event
  const insertEventRes = await sync.InsertEvent(
    network,
    contract,
    eventName,
    `${NODE_URL}`
  );
  console.log("insertEventRes: ", insertEventRes);

  // Event info
  const depositEvent = await sync.GetEvent(address, eventName);
  console.log("depositEvent: ", depositEvent);

  // Get the data from the events
  const depositEventData = await sync.GetEventData(address, eventName);
  console.log("depositEventData: ", depositEventData.data);
})();
