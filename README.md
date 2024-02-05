## Animaijs 

## A simple class to preform animations in vanilla js

## Old school es5 js 

``` 
    // packed in the /build folder

    <script src="animaijs/animaijs.js"></script>
    <script src="examples/fade.js"></script>
    <script>
        
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

    </script>
```

## Modern import syntax

```
    import Animaijs from './src/animaijs.ts';

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

