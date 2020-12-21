import React, { useState } from 'react';
import { ConnectionRecord, Agent, SchemaTemplate, CredDefTemplate, CredentialPreview } from 'aries-framework-javascript';
import {
  StyleSheet,
  View,
  Text,
  Button,
} from 'react-native';
import { CredentialPreviewAttribute } from 'aries-framework-javascript/build/lib/protocols/credentials/messages/CredentialOfferMessage';

type ConnectionProps = {
  connection: ConnectionRecord,
  agent: Agent
}

const Connection = ({ connection, agent }: ConnectionProps) => {
  const [credDefId, setCredDefId] = useState<CredDefId>("")

  const issueCredentialToConnection = async () => {
    // CREATE SCHEMA
    console.log("===========================================================================");
    console.log("CREATE SCHEMA")
    console.log("===========================================================================");
    const schemaTemplate: SchemaTemplate = {
      name: `test-schema`,
      attributes: ['name', 'age'],
      version: '1.1',
    };
    const [schemaId, schema] = await agent.ledger.registerCredentialSchema(schemaTemplate);
    console.log('schemaId', schemaId);
    console.log('schema', schema);
    const ledgerSchema = await agent.ledger.getSchema(schemaId);
    console.log('ledgerSchemaId, ledgerSchema', schemaId, ledgerSchema);

    // CREATE CREDENTIAL DEFINITION
    console.log("===========================================================================");
    console.log("CREATE CREDENTIAL DEFINITION")
    console.log("===========================================================================");
    const definitionTemplate: CredDefTemplate = {
      schema: ledgerSchema,
      tag: 'default',
      signatureType: 'CL',
      config: { support_revocation: false },
    };
    const [credDefId] = await agent.ledger.registerCredentialDefinition(definitionTemplate);
    const ledgerCredDef = await agent.ledger.getCredentialDefinition(credDefId);
    console.log('ledgerCredDefId: ', credDefId);
    console.log('ledgerCredDef: ', ledgerCredDef);
    setCredDefId(credDefId);

    // ISSUE CREDENTIAL
    console.log("===========================================================================");
    console.log("ISSUE CREDENTIAL")
    console.log("===========================================================================");
    const credentialPreview = new CredentialPreview({
      attributes: [
        new CredentialPreviewAttribute({
          name: 'name',
          mimeType: 'text/plain',
          value: 'John',
        }),
        new CredentialPreviewAttribute({
          name: 'age',
          mimeType: 'text/plain',
          value: '99',
        }),
      ],
    });
    agent.credentials.issueCredential(connection, {
      credentialDefinitionId: credDefId,
      comment: 'Test Credential',
      preview: credentialPreview,
    })

  }

  const sendProofRequestToConnection = async () => {
    console.log("===========================================================================");
    console.log("SEND PROOF REQUEST")
    console.log("===========================================================================");
    const req_a = {
      "0_name_uuid": {
        "name": "name",
        "restrictions": [
          {
            "cred_def_id": credDefId
          }
        ]
      },
      "0_age_uuid": {
        "name": "age",
        "restrictions": [
          {
            "cred_def_id": credDefId
          }
        ]
      }
    }
    const proofRequestMessage = {
      name: "Proof of Education",
      version: "1.0",
      nonce: Math.random().toString(),
      requestedAttributes: req_a,
      requestedPredicates: {}
    };

    const proofRequestTemplate = {
      credentialDefinitionId: credDefId,
      comment: 'Test Proof',
      proofRequest: proofRequestMessage
    }

    console.log("Proof Request Template: ", proofRequestTemplate);

    await agent.proof.sendProofRequest(connection, proofRequestTemplate);

    console.log("Sent!")
  }

  return (
    <View style={styles.connectionCard}>
      <Text>Alias: {connection.alias}</Text>
      <Text>ID: {connection.id}</Text>
      <Text>DID: {connection.did}</Text>
      <Text>Their DID: {connection.theirDid}</Text>
      <Text>State: {connection.state}</Text>
      {(connection.alias != 'Mediator') && (<Button
        title="Issue Credential"
        onPress={() => { issueCredentialToConnection(); }} />)}
      {(connection.alias != 'Mediator') && (<Button
        title="Send Proof Request"
        onPress={() => { sendProofRequestToConnection(); }} />)}
    </View>
  );
};

const styles = StyleSheet.create({
  connectionCard: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    margin: 10
  }
});

export default Connection;