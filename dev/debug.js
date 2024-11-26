const fn = () => {
  console.log(this.prop);
};

class C {
  prop = 'prop';

  method() {
    const newFn = fn.bind(this);
    newFn();
  }
}

const c = new C();
c.method();
