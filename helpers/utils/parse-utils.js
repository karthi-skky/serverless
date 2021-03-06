const groupBy = (xs, key) => 
  xs.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});

module.exports = { groupBy };