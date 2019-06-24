(function () {

    /** @global fsbs */
    var foo = 'hello foo';

    this.foo = foo;
}).apply(window);
let t = foo;
