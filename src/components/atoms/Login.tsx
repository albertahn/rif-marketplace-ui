import React from 'react';
import { Account, Web3Provider } from '@rsksmart/rif-ui';
import { ButtonProps } from '@rsksmart/rif-ui/dist/components/atoms/buttons/Button';

const Login = (props: ButtonProps) => (
    <Web3Provider.Consumer>
        {({ state: { web3, networkName, account }, actions: { setProvider } }) => (
            <Account
                web3={web3}
                networkName={networkName}
                account={account}
                setProvider={setProvider}
                {...props}
            />
        )}
    </Web3Provider.Consumer>
);

export default Login;