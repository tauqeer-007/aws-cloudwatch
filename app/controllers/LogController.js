const {
  CloudWatchLogsClient,
  CreateLogGroupCommand,
  DescribeLogGroupsCommand,
  CreateLogStreamCommand,
  PutLogEventsCommand,
} = require("@aws-sdk/client-cloudwatch-logs");
const moment = require("moment");
// ─── Add Log ───────────────────────────────────────────────────────────

exports.addLog = async (req, res) => {
  try {
    const client = new CloudWatchLogsClient({ region: "ap-south-1" });
    const GROUP_NAME = "test-event-log-group-new";
    const LOG_STREAM_NAME = moment().format("Y-m-d") + "-" + moment.now();
    const describeInput = {
      // DescribeLogGroupsRequest
      logGroupNamePrefix: GROUP_NAME,
    };
    const commandDescribeLog = new DescribeLogGroupsCommand(describeInput);
    const existing = await client.send(commandDescribeLog);
    let logGroupExist = existing.logGroups.some(
      (l) => l.logGroupName == GROUP_NAME
    );
    if (!logGroupExist) {
      const input = {
        // CreateLogGroupRequest
        logGroupName: GROUP_NAME,
        logGroupClass: "STANDARD",
      };
      const command = new CreateLogGroupCommand(input);
      await client.send(command);
    }
    const logStreamInput = {
      // CreateLogStreamRequest
      logGroupName: GROUP_NAME,
      logStreamName: LOG_STREAM_NAME,
    };
    console.log("logStreamInput", logStreamInput);
    const logStreamCommand = new CreateLogStreamCommand(logStreamInput);
    await client.send(logStreamCommand);
    const input = {
      // PutLogEventsRequest
      logGroupName: GROUP_NAME,
      logStreamName: LOG_STREAM_NAME,
      logEvents: [
        {
          timestamp: moment.now(),
          message: "User Register Successfully",
        },
      ],
    };
    const command = new PutLogEventsCommand(input);
    const response = await client.send(command);
    console.log("response===================>", response);
    res.status(200).send({
      response: response,
    });
    // process data.
  } catch (e) {
    res.status(500).send({
      message: e.message || "some error occured while retreiving users",
    });
  }
};
