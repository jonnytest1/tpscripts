
document.querySelectorAll('.video-card')
    .forEach(card => {
        return;
        card.addEventListener('mouseover',/**@param {MouseEvent} e*/(e) => {
            let { x, y } = e;
            /**@type {EventTarget& HTMLElement} */
            // @ts-ignore
            const currentCard = e.currentTarget;

            const currentCardRect = currentCard.getBoundingClientRect();
            const cardCenter = {
                x: currentCardRect.left + (currentCardRect.width / 2),
                y: currentCardRect.top + (currentCardRect.height / 2)
            };
            const direction = {
                x: x - cardCenter.x,
                y: y - cardCenter.y
            };
            const directionLength = Math.sqrt(Math.pow(direction.x, 2) + Math.pow(direction.y, 2));
            const scaleFactor = 5;
            const scaledDirection = {
                x: direction.x * scaleFactor / directionLength,
                y: direction.y * scaleFactor / directionLength,
            };
            card.style.transform = `translate(${scaledDirection.x}px,${scaledDirection.y}px)`;
        });

        card.addEventListener('mouseleave', (e) => {
            e.currentTarget.style.transform = 'translate(0)';
        });
    });

