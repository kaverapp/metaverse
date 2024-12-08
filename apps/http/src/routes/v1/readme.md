`Flow chart`
Flowchart Steps:

1. Start

-       Request is made to the POST / route.
-       Middleware (userMiddleware) runs to process or validate the user.

2. Validate Input with CreateSpaceSchema
        
-       Action: Parse the req.body using CreateSpaceSchema.safeParse.
-       Decision: Did validation succeed?
                No: Respond with 400 status and error message.
                Yes: Continue.

3. Check for mapId

-        Decision: Is mapId present in the parsed data?
                No:

                    Action: Create a new space record in the database with data from req.body.
                    Respond with the created space ID.
                Yes:

                    Action: Look up the map using the provided mapId.
                    Decision: Does the map exist?
                            Yes: Continue.
                            No: Respond with 400 status and "map not found".

4. Transaction for space and spaceElements

-        Action: Start a database transaction.
-        Inside the transaction:
                Create a new space record.
                Bulk-insert spaceElements using the map.mapElements data.
-        End Transaction.

5. Respond with the Created space ID

-        Action: Return the created space ID as JSON.

6. End




 `Diagram Representation`




Start --> Validate Input --> Validation Success?
              |                          |
              | No                       | Yes
              |                         v
      Respond with 400         Check for mapId
                                       |
                          mapId present? --- No --> Create space & Respond
                                       |
                                       Yes
                                       v
                           Find map by mapId
                                       |
                         Map Found? --- No --> Respond with 400
                                       |
                                       Yes
                                       v
                        Start Transaction
                          |          |
                          |          v
                          |   Create space
                          |          |
                          |          v
                          |    Create spaceElements
                          |          |
                          v          v
                       Commit Transaction
                                       |
                                       v
                         Respond with space ID
                                       |
                                      End
