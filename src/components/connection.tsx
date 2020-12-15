import React from 'react';
import { ConnectionRecord, Agent, SchemaTemplate } from 'aries-framework-javascript';
import {
  StyleSheet,
  View,
  Text,
  Button
} from 'react-native';
import { CredentialPreview, CredentialPreviewAttribute } from 'aries-framework-javascript/build/lib/protocols/credentials/messages/CredentialOfferMessage';

type ConnectionProps = {
  connection: ConnectionRecord,
  agent: Agent
}

const Connection = ({ connection, agent }: ConnectionProps) => {

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
    const definitionTemplate = {
      schema: ledgerSchema,
      tag: 'default',
      signatureType: 'CL',
      config: { support_revocation: false },
    };
    const [credDefId] = await agent.ledger.registerCredentialDefinition(definitionTemplate);
    const ledgerCredDef = await agent.ledger.getCredentialDefinition(credDefId);
    console.log('ledgerCredDefId: ', credDefId);
    console.log('ledgerCredDef: ', ledgerCredDef);

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

  return (
    <View style={styles.connectionCard}>
      <Text>Alias: {connection.alias}</Text>
      <Text>ID: {connection.id}</Text>
      <Text>DID: {connection.did}</Text>
      <Text>Their DID: {connection.theirDid}</Text>
      <Text>State: {connection.state}</Text>
      {!(connection.alias == 'Mediator') && (<Button
        title="Issue Credential"
        onPress={() => { issueCredentialToConnection(); }} />)}
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
