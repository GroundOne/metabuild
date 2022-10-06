import { useState, useEffect, useMemo, useRef } from 'react';

import { Wallet } from '../../utils/near-wallet';
import { HelloNEAR } from '../../utils/near-interface';
import AppCard from '../UI/AppCard';

export default function WalletSample() {


    // When creating the wallet you can optionally ask to create an access key
    // Having the key enables to call non-payable methods without interrupting the user to sign
    const wallet = useMemo(() => {
        return new Wallet({ createAccessKeyFor: process.env.CONTRACT_NAME || 'dev-1665005820930-76578839337905' });
    }, []);

    // Abstract the logic of interacting with the contract to simplify your flow
    const helloNEAR = new HelloNEAR({
        contractId: process.env.CONTRACT_NAME || 'dev-1665005820930-76578839337905',
        walletToUse: wallet,
    });

    const [signedIn, setSignedIn] = useState('loading...');

    useEffect(() => {
        async function init() {
            let isSignedIn = await wallet.startUp();

            if (isSignedIn) {
                setSignedIn('In');
            } else {
                setSignedIn('Out');
            }
        }
        init();
    }, [wallet]);

    return (
        <AppCard>
            <div className="font-semibold">Wallet functions</div>
            <div>Status: {signedIn}</div>
            <button
                type='button'
                onClick={wallet.signIn}
                    className="ff-btn-primary mt-10 w-1/2 bg-[#C3CED8] text-white hover:bg-opacity-90 hover:text-white"
                >
                    {signedIn === 'Out' ? 'Sign In' : 'Sign Out'}
                </button>
        </AppCard>
    );
}

// // Setup on page load
// window.onload = async () => {
//   let isSignedIn = await wallet.startUp();

//   if (isSignedIn) {
//     signedInFlow();
//   } else {
//     signedOutFlow();
//   }

//   fetchGreeting();
// };

// // Button clicks
// document.querySelector('form').onsubmit = doUserAction;
// document.querySelector('#sign-in-button').onclick = () => { wallet.signIn(); };
// document.querySelector('#sign-out-button').onclick = () => { wallet.signOut(); };

// // Take the new greeting and send it to the contract
// async function doUserAction(event) {
//   event.preventDefault();
//   const { greeting } = event.target.elements;

//   document.querySelector('#signed-in-flow main')
//     .classList.add('please-wait');

//   await helloNEAR.setGreeting(greeting.value);

//   // ===== Fetch the data from the blockchain =====
//   await fetchGreeting();
//   document.querySelector('#signed-in-flow main')
//     .classList.remove('please-wait');
// }

// // Get greeting from the contract on chain
// async function fetchGreeting() {
//   const currentGreeting = await helloNEAR.getGreeting();

//   document.querySelectorAll('[data-behavior=greeting]').forEach(el => {
//     el.innerText = currentGreeting;
//     el.value = currentGreeting;
//   });
// }

// // Display the signed-out-flow container
// function signedOutFlow() {
//   document.querySelector('#signed-in-flow').style.display = 'none';
//   document.querySelector('#signed-out-flow').style.display = 'block';
// }

// // Displaying the signed in flow container and fill in account-specific data
// function signedInFlow() {
//   document.querySelector('#signed-out-flow').style.display = 'none';
//   document.querySelector('#signed-in-flow').style.display = 'block';
//   document.querySelectorAll('[data-behavior=account-id]').forEach(el => {
//     el.innerText = wallet.accountId;
//   });
// }
