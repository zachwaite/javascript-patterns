"use strict";

const odbc = require("odbc");
const connInfo = {
  connectionString: "DSN=" + process.env.DSN + ";UID=ZWAITE;PWD= + " process.env.PASSWORD + ";",
  connectionTimeout: 10,
  loginTimeout: 10,
};

const sql =
  "SELECT message_data FROM table (qsys2.receive_data_queue(data_queue => 'DTA1', data_queue_library => 'ZWAITE1', WAIT_TIME => 1))";

async function processDataQueue() {
  const conn = await odbc.connect(connInfo);

  try {
    while (true) {
      const rs = await conn.query(sql);

      // nothing in queue; exit early
      if (rs.count == 0) {
        console.log("Queue is empty...");
        continue;
      }

      console.log(`Message is ${rs[0].MESSAGE_DATA}`);

      // check if end of processing detected
      if (rs[0].MESSAGE_DATA == "*END") {
        console.log("End of processing signal received ...");
        return;
      }

      // any results back
      if (rs.count == 0) {
        console.log("Queue is empty...");
        continue;
      }
    }
  } catch (err) {
    console.error(`Error: ${err.stack}`);
  }
}

processDataQueue();
