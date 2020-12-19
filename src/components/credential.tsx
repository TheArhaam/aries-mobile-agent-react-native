import React from 'react';
import { CredentialRecord, Agent } from 'aries-framework-javascript';
import {
  StyleSheet,
  View,
  Text,
  Button
} from 'react-native';

type CredentialProps = {
  credential: CredentialRecord,
  agent: Agent
}

const Credential = ({ credential, agent }: CredentialProps) => {

  const value = JSON.parse(credential.getValue());
  return (
    <View style={styles.credentialCard}>
      <Text>ID: {credential.id}</Text>
      <Text>State: {credential.state}</Text>
      <Text>Type: {credential.type}</Text>
      <Text>Values:</Text>
      {value.offer && (
        value.offer.credential_preview.attributes.map((attr) => {
          return (
            <Text>{attr["name"]}: {attr["value"]}</Text>
          )
        })
      )}
      {(credential.state == "OFFER_RECEIVED") && (
        <Button title="Accept Credential" onPress={async () => {
          await agent.credentials.acceptCredential(credential);
          console.log("Credential Accepted");
        }} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  credentialCard: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    margin: 10
  },
  row: {
    flexDirection: 'row'
  }
});

export default Credential;