import { Injectable } from "@nestjs/common";
import { Connection, WorkflowClient } from "@temporalio/client";

@Injectable()
export class WorkflowService {
  public client: WorkflowClient;

  constructor() {
    const connection = new Connection(); // Connect to localhost with default ConnectionOptions.
    // In production, pass options to the Connection constructor to configure TLS and other settings.
    // This is optional but we leave this here to remind you there is a gRPC connection being established.

    this.client = new WorkflowClient(connection.service, {
      // In production you will likely specify `namespace` here; it is 'default' if omitted
    });
  }


}
