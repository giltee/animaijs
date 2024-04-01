## Animaijs 

## A simple class to preform animations in vanilla js

## Docs
- [Documentation](https://webmeau.ca/animaijs)

## Npm 
https://www.npmjs.com/package/animaijs
npm i --save animaijs

## build vanilla class file
```
    # remove export default in animaijs.ts
    tsc // needs typscript installed
```

## Import

```
    import Animaijs from './src/animaijs.ts';

    // fade out current image and fade in secondary image when mouse enters the card
    const hoverImage = () => {

        document
        .querySelectorAll('.card')
        .forEach( el => {
            
            const images = el.querySelectorAll('img');
            const one = new Animaijs(images[0]);
            const two = new Animaijs(images[1]);
            const time = 1000;

            el.addEventListener('mouseenter', () => {
                one.fadeOut(time);
                two.fadeIn(time);
            });

            el.addEventListener('mouseleave', () => {
                two.fadeOut(time);
                one.fadeIn(time);
            });
            
        })
    }

    hoverImage();
```

## React  
```
    /*  
    Bounce element 4 times with a starting
    height of 20 pixles when 50% of the element is visible in the view port
    */
    const InfoCard = ({ body, icon, title }: CardProps ) => {
    let ani: Animaijs;
    const cardRef = useRef(null);

    useEffect(() => {
        ani = new Animaijs(cardRef.current);
        ani.observeIntersection(() => ani.bounce(100, {bounces: 4, bounceHeight: 20}), 
            {root: null, rootMargin: '0px', threshold: .5}
        );
    });

    return(
        <div className={styles.info} ref={cardRef}>
            <span className="material-symbols-outlined">{ icon }</span>
            <h3>{ title }</h3>
            <p>{ body }</p>
        </div>
    )
```
