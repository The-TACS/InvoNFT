// main.js

// Register Form Submission
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const country = document.getElementById('country').value;

            try {
                const response = await fetch('https://your-backend-api.com/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, email, password, country }),
                });

                const data = await response.json();
                const registerMessage = document.getElementById('registerMessage');
                if (response.ok) {
                    registerMessage.style.color = 'green';
                    registerMessage.textContent = 'Registration successful! Please verify your account.';
                    registerForm.reset();
                } else {
                    registerMessage.style.color = 'red';
                    registerMessage.textContent = data.message || 'Registration failed.';
                }
            } catch (error) {
                console.error('Error:', error);
                const registerMessage = document.getElementById('registerMessage');
                registerMessage.style.color = 'red';
                registerMessage.textContent = 'An error occurred. Please try again.';
            }
        });
    }

    // Login Form Submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const response = await fetch('https://your-backend-api.com/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                    credentials: 'include', // to include cookies
                });

                const data = await response.json();
                const loginMessage = document.getElementById('loginMessage');
                if (response.ok) {
                    loginMessage.style.color = 'green';
                    loginMessage.textContent = 'Login successful! Redirecting...';
                    setTimeout(() => {
                        window.location.href = 'profile.html';
                    }, 2000);
                } else {
                    loginMessage.style.color = 'red';
                    loginMessage.textContent = data.message || 'Login failed.';
                }
            } catch (error) {
                console.error('Error:', error);
                const loginMessage = document.getElementById('loginMessage');
                loginMessage.style.color = 'red';
                loginMessage.textContent = 'An error occurred. Please try again.';
            }
        });
    }

    // Verification Form Submission
    const verifyForm = document.getElementById('verifyForm');
    if (verifyForm) {
        verifyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const documentType = document.getElementById('documentType').value;
            const documentFile = document.getElementById('documentFile').files[0];

            if (!documentFile) {
                alert('Please select a document file.');
                return;
            }

            const formData = new FormData();
            formData.append('documentType', documentType);
            formData.append('documentFile', documentFile);

            try {
                const response = await fetch('https://your-backend-api.com/api/verify', {
                    method: 'POST',
                    body: formData,
                    credentials: 'include', // to include cookies
                });

                const data = await response.json();
                const verifyMessage = document.getElementById('verifyMessage');
                if (response.ok) {
                    verifyMessage.style.color = 'green';
                    verifyMessage.textContent = 'Verification submitted successfully!';
                    verifyForm.reset();
                } else {
                    verifyMessage.style.color = 'red';
                    verifyMessage.textContent = data.message || 'Verification failed.';
                }
            } catch (error) {
                console.error('Error:', error);
                const verifyMessage = document.getElementById('verifyMessage');
                verifyMessage.style.color = 'red';
                verifyMessage.textContent = 'An error occurred. Please try again.';
            }
        });
    }

    // Load User Profile
    const userProfile = document.getElementById('userProfile');
    if (userProfile) {
        fetch('https://your-backend-api.com/api/profile', {
            method: 'GET',
            credentials: 'include', // to include cookies
        })
        .then(response => response.json())
        .then(data => {
            if (data.user) {
                userProfile.innerHTML = `
                    <p><strong>Username:</strong> ${data.user.username}</p>
                    <p><strong>Email:</strong> ${data.user.email}</p>
                    <p><strong>Country:</strong> ${data.user.country}</p>
                    <p><strong>Wallet Address:</strong> ${data.user.walletAddress || 'Not connected'}</p>
                    <p><strong>Verification Status:</strong> ${data.user.isVerified ? 'Verified' : 'Not Verified'}</p>
                `;
            } else {
                userProfile.innerHTML = `<p>User not found.</p>`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            userProfile.innerHTML = `<p>An error occurred while fetching profile.</p>`;
        });
    }

    // Load NFTs in Marketplace
    const nftMarketplace = document.getElementById('nftMarketplace');
    if (nftMarketplace) {
        fetch('https://your-backend-api.com/api/nfts')
            .then(response => response.json())
            .then(data => {
                if (data.nfts && data.nfts.length > 0) {
                    data.nfts.forEach(nft => {
                        const nftCard = document.createElement('div');
                        nftCard.classList.add('nft-card');
                        nftCard.innerHTML = `
                            <img src="${nft.image}" alt="${nft.name}">
                            <div class="nft-info">
                                <h3>${nft.name}</h3>
                                <p>${nft.description}</p>
                                <p class="price">Price: ${nft.price} NeoX Gas</p>
                                <button onclick="buyNFT('${nft.id}')">Buy</button>
                            </div>
                        `;
                        nftMarketplace.appendChild(nftCard);
                    });
                } else {
                    nftMarketplace.innerHTML = `<p>No NFTs available for sale.</p>`;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                nftMarketplace.innerHTML = `<p>An error occurred while fetching NFTs.</p>`;
            });
    }

    // Buy NFT Function
    async function buyNFT(nftId) {
        if (typeof window.ethereum === 'undefined') {
            alert('MetaMask is not installed!');
            return;
        }

        const web3 = new Web3(window.ethereum);
        try {
            // Request account access if needed
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            const account = accounts[0];

            // Interact with the NFT smart contract
            const contractABI = [/* Your NFT Contract ABI */];
            const contractAddress = '0xYourNFTContractAddress';
            const contract = new web3.eth.Contract(contractABI, contractAddress);

            // Assuming the contract has a buyNFT method
            const priceInWei = web3.utils.toWei('1', 'ether'); // Replace with actual price

            await contract.methods.buyNFT(nftId).send({ from: account, value: priceInWei });

            alert('NFT purchased successfully!');
            // Optionally, refresh the marketplace or user profile
        } catch (error) {
            console.error(error);
            alert('Transaction failed!');
        }
    }
});
