import React from 'react';
import { Agent, ProofRecord } from 'aries-framework-javascript';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';

type ProofRequestProps = {
    proof: ProofRecord,
    agent: Agent
}

const ProofRequest = ({ agent, proof }: ProofRequestProps) => {

    return (
        <View style={styles.proofRequestCard}>
            <Text>ID: {proof.id}</Text>
            <Text>Connection ID: {proof.connectionId}</Text>
            <Text>State: {proof.state}</Text>
            <Text>Type: {proof.type}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    proofRequestCard: {
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
        margin: 10
    },
    row: {
        flexDirection: 'row'
    }
});

export default ProofRequest;