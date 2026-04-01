lucide.createIcons();
        
        const examples = {
            bank: "URGENT: Your account access has been restricted. Verify your identity immediately or your account will be locked: http://verify-citi-secure.net/auth",
            url: "Your package delivery failed. Please pay the $1.40 redelivery fee here: https://usps-tracking-portal-online.com/fee",
            friendly: "Hey, are you free rn? need a quick favor... can you get a steam card for me from the shop? I'll pay you back tonight",
            netflix: "Netflix: Your payment method was declined. Update your billing address immediately to avoid suspension: http://netflix-billing-update-secure.com",
            delivery: "FedEx: Delivery attempt failed for parcel #89304. Missing delivery fee of $1.99. Repay here to avoid return to sender: https://fedx-logistics-pay.com"
        };
        const sims = {
            bank: "ALERT: Unusual login attempt on your account from IP 192.168.x.x. If this was not you, your account will be temporarily frozen in 15 minutes. Secure it now: https://verify-citi-secure.net/auth",
        };

        function switchTab(tabId) {
            const tabs = ['analyze', 'intel', 'shields', 'tools', 'simulate', 'train'];
            let currentActive = null;

            // Find current active
            tabs.forEach(t => {
                const view = document.getElementById(`view-${t}`);
                if(view && view.classList.contains('active')) currentActive = view;
            });

            // Update buttons
            tabs.forEach(t => {
                const btn = document.getElementById(`nav-${t}`);
                if(!btn) return;
                if (t === tabId) btn.className = "px-3 md:px-5 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 text-deep bg-textPrimary shadow-md scale-105";
                else btn.className = "px-3 md:px-5 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 text-textSecondary hover:text-white bg-transparent";
            });

            const targetView = document.getElementById(`view-${tabId}`);
            
            const startTransition = () => {
                if (targetView) {
                    targetView.classList.add('active');
                    // Small delay to allow display to apply before fading in
                    setTimeout(() => targetView.classList.add('show'), 20);
                }
            };

            if (currentActive && currentActive !== targetView) {
                currentActive.classList.remove('show');
                // Wait for CSS transition to finish before hiding display
                setTimeout(() => {
                    currentActive.classList.remove('active');
                    startTransition();
                }, 250); // Fluid 0.25s transition
            } else if (!currentActive) {
                startTransition();
            }

            const hero = document.getElementById('heroHeader');
            if(hero) {
                if(tabId === 'analyze') {
                    hero.style.display = 'block';
                    setTimeout(() => hero.style.opacity = '1', 20);
                } else {
                    hero.style.opacity = '0'; 
                    setTimeout(() => hero.style.display = 'none', 250);
                }
            }
            window.scrollTo({top: 0, behavior: 'smooth'});
        }

        function fillExample(key) {
            const el = document.getElementById('analyzeInput');
            el.value = examples[key];
            el.focus();
        }

        function runAnalysis() {
            const input = document.getElementById('analyzeInput');
            if (!input.value.trim()) return;

            document.querySelectorAll('.progress-bar-fill').forEach(bar => bar.style.width = '0%');

            document.getElementById('analyzeCardContainer').classList.add('hidden');
            const intro = document.getElementById('introFeatures');
            if(intro) intro.classList.add('hidden');

            const loader = document.getElementById('loadingState');
            loader.classList.remove('hidden');
            loader.classList.add('flex');

            setTimeout(() => {
                loader.classList.add('hidden');
                loader.classList.remove('flex');
                
                const res = document.getElementById('resultsDashboard');
                res.classList.remove('hidden');
                res.classList.add('flex');
                
                if(input.value.includes('http')) document.getElementById('urlDecoderCard').classList.remove('hidden');
                else document.getElementById('urlDecoderCard').classList.add('hidden');

                setTimeout(() => {
                    const ring = document.getElementById('confidenceRing');
                    if(ring) ring.setAttribute('stroke-dasharray', '96, 100');
                    document.querySelectorAll('.progress-bar-fill').forEach(bar => {
                        bar.style.width = bar.getAttribute('data-target');
                    });
                }, 100);

            }, 2000);
        }

        function resetAnalysis() {
            document.getElementById('analyzeInput').value = '';
            document.getElementById('resultsDashboard').classList.add('hidden');
            document.getElementById('resultsDashboard').classList.remove('flex');
            
            const card = document.getElementById('analyzeCardContainer');
            card.classList.remove('hidden');
            card.classList.add('block');
            
            const intro = document.getElementById('introFeatures');
            if(intro) intro.classList.remove('hidden');
            
            window.scrollTo({top: 0, behavior: 'smooth'});
        }

        // --- Tools Logic ---
        function openToolModal(toolId) {
            const overlay = document.getElementById('toolModalOverlay');
            const content = document.getElementById('toolModalContent');
            
            // Hide all views, open desired
            document.querySelectorAll('.modal-tool-view').forEach(el => el.classList.remove('active'));
            document.getElementById(toolId).classList.add('active');
            
            resetToolScan(toolId.split('-')[1]); // Ensure clean state
            
            overlay.classList.remove('hidden');
            overlay.classList.add('flex');
            
            // Animate in
            setTimeout(() => {
                overlay.classList.remove('opacity-0');
                overlay.classList.add('opacity-100');
                content.classList.remove('scale-95', 'translate-y-4', 'opacity-0');
                content.classList.add('scale-100', 'translate-y-0', 'opacity-100');
            }, 20);
        }

        function closeToolModal() {
            const overlay = document.getElementById('toolModalOverlay');
            const content = document.getElementById('toolModalContent');
            
            overlay.classList.remove('opacity-100');
            overlay.classList.add('opacity-0');
            content.classList.remove('scale-100', 'translate-y-0', 'opacity-100');
            content.classList.add('scale-95', 'translate-y-4', 'opacity-0');
            
            setTimeout(() => {
                overlay.classList.add('hidden');
                overlay.classList.remove('flex');
            }, 500);
        }

        function runToolScan(type) {
            const inputEl = document.getElementById(`tool-${type}-input`);
            if(!inputEl.value.trim()) return;

            document.getElementById(`tool-${type}-input-view`).classList.add('hidden');
            const loader = document.getElementById(`tool-${type}-loading`);
            loader.classList.remove('hidden');
            loader.classList.add('flex');

            setTimeout(() => {
                loader.classList.add('hidden');
                loader.classList.remove('flex');
                
                const res = document.getElementById(`tool-${type}-result`);
                res.classList.remove('hidden');
                res.classList.add('flex');
            }, 1500);
        }

        function resetToolScan(type) {
            const inputEl = document.getElementById(`tool-${type}-input`);
            if(inputEl) inputEl.value = '';
            
            const inputView = document.getElementById(`tool-${type}-input-view`);
            if(inputView) inputView.classList.remove('hidden');
            
            const loader = document.getElementById(`tool-${type}-loading`);
            if(loader) {
                loader.classList.add('hidden');
                loader.classList.remove('flex');
            }
            
            const res = document.getElementById(`tool-${type}-result`);
            if(res) {
                res.classList.add('hidden');
                res.classList.remove('flex');
            }
        }

        // --- Simulation Logic ---
        let simInterval;
        const simAudioText = "Hey... it's me. Listen, I'm in huge trouble. I dropped my phone and the screen is totally dead, I'm using someone else's right now. Please don't panic, but I'm stranded and I desperately need you to wire $500 to this new number immediately. Please... I'll explain everything later, I just need help right now.";
        
        function playVoiceScam() {
            document.getElementById('startSimBtn').classList.add('hidden');
            const dash = document.getElementById('simActiveDashboard');
            dash.classList.remove('hidden');
            dash.classList.add('flex');
            
            const transcript = document.getElementById('simTranscript');
            const tags = document.getElementById('simTags');
            const resetBtn = document.getElementById('resetSimBtn');
            transcript.innerHTML = '';
            tags.innerHTML = '';
            resetBtn.classList.add('hidden');
            
            let i = 0;
            const words = simAudioText.split(' ');
            
            simInterval = setInterval(() => {
                if (i < words.length) {
                    transcript.innerHTML += words[i] + ' ';
                    
                    // Trigger tags at certain lengths
                    if (i === 5) {
                        tags.innerHTML += `<span class="px-2 py-1 bg-purpleAccent/10 border border-purpleAccent/30 text-purpleAccent text-[10px] font-bold rounded shadow-sm fade-in">Isolation Tactic Detected</span>`;
                    }
                    if (i === 15) {
                        tags.innerHTML += `<span class="px-2 py-1 bg-warningAmber/10 border border-warningAmber/30 text-warningAmber text-[10px] font-bold rounded shadow-sm fade-in">Artificial Crisis Built</span>`;
                    }
                    if (i === 30) {
                        tags.innerHTML += `<span class="px-2 py-1 bg-dangerRed/10 border border-dangerRed/30 text-dangerRed text-[10px] font-bold rounded shadow-sm fade-in">Financial Demand</span>`;
                    }
                    
                    i++;
                } else {
                    clearInterval(simInterval);
                    document.getElementById('waveformContainer').innerHTML = `<div class="w-full text-center text-xs text-textSecondary uppercase tracking-widest font-bold mt-3">Audio Simulation Complete</div>`;
                    resetBtn.classList.remove('hidden');
                }
            }, 250); // 250ms per word typing effect
        }

        function resetSimulation() {
            clearInterval(simInterval);
            document.getElementById('startSimBtn').classList.remove('hidden');
            document.getElementById('simActiveDashboard').classList.add('hidden');
            document.getElementById('simActiveDashboard').classList.remove('flex');
            document.getElementById('waveformContainer').innerHTML = `
                 <div class="w-2 bg-cyanGlow/40 rounded-full h-2"></div>
                 <div class="w-2 bg-cyanGlow/60 rounded-full h-8 animate-wave bar-1"></div>
                 <div class="w-2 bg-cyanGlow/80 rounded-full h-12 animate-wave bar-2"></div>
                 <div class="w-2 bg-cyanGlow rounded-full h-4 animate-wave bar-3"></div>
                 <div class="w-2 bg-cyanGlow/80 rounded-full h-10 animate-wave bar-4"></div>
                 <div class="w-2 bg-cyanGlow/60 rounded-full h-6 animate-wave bar-5"></div>
                 <div class="w-2 bg-cyanGlow/40 rounded-full h-2"></div>
            `;
        }

        // --- Attack Compiler Logic ---
        function compileAttack() {
            const target = document.getElementById('builderTarget').value;
            const emotion = document.getElementById('builderEmotion').value;
            let result = "";

            if(target === 'employee' && emotion === 'fear') result = "URGENT HR NOTIFICATION: Your Q3 performance review requires immediate signature. Failure to docu-sign before 5:00 PM EST will result in temporary payroll suspension. Review here: https://okta-hr-secure-portal.com/auth";
            else if(target === 'employee' && emotion === 'greed') result = "Finance Dept: We identified an error causing a $450 under-payment in your last check. Please confirm your direct deposit routing via the internal compensation portal to expedite transfer: https://workday-compensation-adjust.com";
            else if(target === 'employee' && emotion === 'help') result = "Hi, it's the CEO. I'm stuck in a board meeting and need a huge favor. Can you buy 5 Apple gift cards for a client presentation right now? I will reimburse your expense account tonight.";
            else if(target === 'senior' && emotion === 'fear') result = "Medicare Alert: Your health coverage is scheduled for cancellation in 24 hours due to missing documentation. Please update your SSN file immediately: https://medicare-gov-secure-records.net";
            else if(target === 'senior' && emotion === 'greed') result = "Social Security Dept: You are eligible for a $1,200 backpay adjustment from the latest stimulus relief. Claim your direct deposit immediately before the deadline closes: https://ssa-benefits-claim.com";
            else if(target === 'senior' && emotion === 'help') result = "Hi grandma, I lost my phone and I'm using a friend's. I'm stranded and desperately need you to wire $200 so I can get a cab home. Please don't tell mom right now. xx";
            else if(target === 'shopper' && emotion === 'fear') result = "Amazon Alert: Your account is locked due to suspicious activity regarding a $1,400 MacBook Pro order. If you did not make this purchase, cancel the transaction immediately: https://amazon-fraud-cancellation.support";
            else if(target === 'shopper' && emotion === 'greed') result = "Congratulations! You have been selected to participate in an exclusive 5-minute survey. Complete it now to receive a free $100 Amazon Gift Card: https://amazon-survey-rewards-promo.com";
            else result = "Can you do me a quick favor? Download this attachment and let me know your thoughts... I can't open it on my end."; 

            document.getElementById('builderOutput').classList.remove('hidden');
            setTimeout(() => { document.getElementById('compiledPayloadText').innerText = result; }, 50);
        }

        // --- Swipe Minigame Logic ---
        const swipeDeck = [
            { 
                id: 1, 
                type: 'phish',
                platform: 'sms',
                sender: 'PayPal Alert',
                text: "We noticed a suspicious login from Russia. If this wasn't you, freeze your account immediately: https://paypal-fraud-center.support", 
                explanation: "Spoofed Sender & URL: The link points to 'paypal-fraud-center.support', not the official paypal.com domain."
            },
            { 
                id: 2, 
                type: 'safe',
                platform: 'imessage',
                sender: 'Sarah (Marketing)',
                text: "Are we still on for 4pm today? Let me know if we need to push to tomorrow.", 
                explanation: "Normal context, no links, and no artificial urgency or demands."
            },
            { 
                id: 3, 
                type: 'phish',
                platform: 'email',
                sender: 'Apple Support <noreply@apple-cloud-storage.com>',
                subject: 'URGENT: Storage Full',
                text: "Your iCloud storage is full. 23 photos are scheduled for deletion in 1 hour. Upgrade space now to prevent data loss: <a href='#' class='text-cyanGlow underline'>Upgrade Now</a>", 
                explanation: "Artificial Urgency: Threatening data deletion in '1 hour' to force immediate, panicked action."
            },
            { 
                id: 4, 
                type: 'safe',
                platform: 'email',
                sender: 'Amazon <shipment@amazon.com>',
                subject: 'Delivery Update',
                text: "Your Amazon delivery status has been updated. Track your package securely at your account dashboard here: https://www.amazon.com/track/xyz123", 
                explanation: "Official domain used (amazon.com) and no weird subdomains."
            },
            { 
                id: 5, 
                type: 'phish',
                platform: 'slack',
                sender: 'IT-Admin-Tom',
                text: "Hey, we're migrating servers tonight. Please verify your Okta credentials here so you don't lose access tomorrow: http://okta-migration-internal.net", 
                explanation: "Credential harvesting: Unofficial link. IT will never ask you to 'verify credentials' on a weird .net domain."
            }
        ];

        let currentCardIndex = 0;
        let swipeScoreVal = 0;
        let swipeStreakVal = 0;
        let waitingForFeedback = false;

        function initSwipeGame() {
            currentCardIndex = 0;
            swipeScoreVal = 0;
            swipeStreakVal = 0;
            waitingForFeedback = false;
            updateSwipeUI();
            renderNextCard();
        }

        function renderNextCard() {
            const area = document.getElementById('swipeCardsArea');
            area.innerHTML = '';
            waitingForFeedback = false;
            
            if (currentCardIndex >= swipeDeck.length) {
                document.getElementById('swipeDeckContainer').classList.add('hidden');
                document.getElementById('swipeEndScreen').classList.remove('hidden');
                document.getElementById('swipeEndScreen').classList.add('flex');
                
                // Animate final numbers
                let count = 0;
                let inc = Math.max(1, Math.floor(swipeScoreVal / 20));
                let intv = setInterval(() => {
                    count += inc;
                    if(count >= swipeScoreVal) {
                        count = swipeScoreVal;
                        clearInterval(intv);
                    }
                    document.getElementById('finalScoreDisplay').innerText = count;
                }, 40);
                return;
            }

            const cardData = swipeDeck[currentCardIndex];
            const cardEl = document.createElement('div');
            cardEl.id = 'activeSwipeCard';
            cardEl.className = 'absolute top-0 left-0 w-full h-full bg-deep shadow-[0_10px_40px_rgba(0,0,0,0.8)] transition-all duration-300 z-10 transform-gpu overflow-hidden flex flex-col border border-white/10 rounded-3xl';
            
            // Generate Inner HTML based on platform
            let innerContent = '';
            if(cardData.platform === 'email') {
                innerContent = `
                    <div class="bg-surfaceLight border-b border-white/5 p-4 py-3 flex flex-col gap-1">
                        <div class="flex items-center gap-2 text-xs font-bold text-white"><i data-lucide="mail" class="w-3 h-3 text-textSecondary"></i> ${cardData.sender}</div>
                        <div class="text-[11px] font-semibold text-white truncate">Subject: ${cardData.subject}</div>
                    </div>
                    <div class="p-6 text-sm text-textPrimary leading-relaxed text-left flex-grow">
                        ${cardData.text}
                    </div>
                `;
            } else if (cardData.platform === 'sms' || cardData.platform === 'imessage') {
                const isBlue = cardData.platform === 'imessage';
                innerContent = `
                     <div class="flex flex-col h-full bg-surface">
                         <div class="flex justify-center py-3 border-b border-white/5 bg-surfaceLight">
                             <div class="flex flex-col items-center">
                                 <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mb-1"><i data-lucide="user" class="w-4 h-4 text-white"></i></div>
                                 <span class="text-[10px] font-bold text-white tracking-wide">${cardData.sender}</span>
                             </div>
                         </div>
                         <div class="p-6 flex-grow flex flex-col justify-end pb-8">
                             <div class="text-[9px] text-center text-textSecondary mb-3">Today 10:41 AM</div>
                             <div class="${isBlue ? 'bg-blue-600' : 'bg-green-600'} text-white py-3 px-4 rounded-2xl shadow-sm self-start max-w-[90%] rounded-bl-sm text-left text-[13px] leading-relaxed">
                                 ${cardData.text}
                             </div>
                         </div>
                     </div>
                `;
            } else if (cardData.platform === 'slack') {
                innerContent = `
                    <div class="bg-surface p-6 flex items-start gap-4 h-full">
                        <div class="w-10 h-10 rounded bg-purpleAccent/20 flex items-center justify-center shrink-0 border border-purpleAccent/30"><i data-lucide="hash" class="w-5 h-5 text-purpleAccent"></i></div>
                        <div class="text-left w-full">
                            <div class="flex items-center gap-2 mb-1">
                                <span class="text-sm font-bold text-white">${cardData.sender}</span>
                                <span class="text-[10px] text-textSecondary">11:04 AM</span>
                            </div>
                            <div class="text-[13px] text-textPrimary leading-relaxed w-full">
                                ${cardData.text}
                            </div>
                        </div>
                    </div>
                `;
            }

            cardEl.innerHTML = `
                <div class="absolute top-3 right-4 flex gap-1 z-20"><div class="w-1.5 h-1.5 rounded-full bg-dangerRed"></div><div class="w-1.5 h-1.5 rounded-full bg-warningAmber"></div><div class="w-1.5 h-1.5 rounded-full bg-trustGreen"></div></div>
                <div class="w-full h-full relative z-10">
                    ${innerContent}
                </div>
                <!-- Feedback Overlay -->
                <div id="swipeFeedbackOverlay" class="absolute inset-0 z-30 bg-black/90 backdrop-blur-sm p-6 flex-col justify-center text-center hidden hidden-items translate-y-4 opacity-0 transition-all duration-300">
                    <div id="swipeFeedbackIcon" class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2"></div>
                    <h3 id="swipeFeedbackTitle" class="text-2xl font-black text-white mb-2 tracking-tight"></h3>
                    <p id="swipeFeedbackText" class="text-sm text-textSecondary leading-relaxed mb-6"></p>
                    <button id="swipeFeedbackBtn" class="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-colors">Continue <i data-lucide="arrow-right" class="w-4 h-4 inline ml-1"></i></button>
                </div>
            `;
            area.appendChild(cardEl);
            lucide.createIcons();
        }

        function handleSwipe(guessType) {
            if (currentCardIndex >= swipeDeck.length || waitingForFeedback) return;
            waitingForFeedback = true;
            
            const cardData = swipeDeck[currentCardIndex];
            const isCorrect = guessType === cardData.type;
            
            const cardEl = document.getElementById('activeSwipeCard');
            if(!cardEl) return;
            
            // Pop the overlay
            const overlay = document.getElementById('swipeFeedbackOverlay');
            const icon = document.getElementById('swipeFeedbackIcon');
            const title = document.getElementById('swipeFeedbackTitle');
            const text = document.getElementById('swipeFeedbackText');
            const nextBtn = document.getElementById('swipeFeedbackBtn');
            
            overlay.classList.remove('hidden', 'hidden-items');
            overlay.classList.add('flex');
            
            setTimeout(() => {
                overlay.classList.remove('translate-y-4', 'opacity-0');
            }, 10);
            
            if (isCorrect) {
                 swipeScoreVal += 100 + (swipeStreakVal * 50);
                 swipeStreakVal++;
                 
                 icon.className = 'w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border-2 bg-trustGreen/20 border-trustGreen text-trustGreen shadow-[0_0_20px_rgba(34,197,94,0.4)]';
                 icon.innerHTML = '<i data-lucide="check" class="w-6 h-6"></i>';
                 title.innerText = "Correct Instinct!";
                 title.className = "text-xl font-black text-trustGreen mb-2 tracking-tight";
            } else {
                 swipeStreakVal = 0;
                 
                 icon.className = 'w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border-2 bg-dangerRed/20 border-dangerRed text-dangerRed shadow-[0_0_20px_rgba(239,68,68,0.4)]';
                 icon.innerHTML = '<i data-lucide="x" class="w-6 h-6"></i>';
                 title.innerText = "Security Miss";
                 title.className = "text-xl font-black text-dangerRed mb-2 tracking-tight";
            }
            
            text.innerText = cardData.explanation;
            updateSwipeUI();
            lucide.createIcons();

            // Next card logic bound to the button
            nextBtn.onclick = () => {
                 cardEl.style.transform = guessType === 'safe' ? 'translate(150%, 40px) rotate(25deg)' : 'translate(-150%, 40px) rotate(-25deg)';
                 cardEl.style.opacity = '0';
                 setTimeout(() => {
                     currentCardIndex++;
                     renderNextCard();
                 }, 350);
            };
        }

        function updateSwipeUI() {
            document.getElementById('swipeScore').innerText = swipeScoreVal;
            document.getElementById('swipeStreak').innerText = swipeStreakVal;
        }

        function resetSwipeGame() {
            document.getElementById('swipeEndScreen').classList.add('hidden');
            document.getElementById('swipeEndScreen').classList.remove('flex');
            document.getElementById('swipeDeckContainer').classList.remove('hidden');
            initSwipeGame();
        }

        // Initialize game when viewing tab
        document.getElementById('nav-train').addEventListener('click', () => {
            if(document.getElementById('swipeEndScreen').classList.contains('hidden') && currentCardIndex === 0) {
                 initSwipeGame();
            }
        });
        
        // Also init on load just in case
        initSwipeGame();

