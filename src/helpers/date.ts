const get24Range = () => {
  const start = new Date();
  const end = new Date();
  start.setUTCHours(0, 0, 0, 0);
  end.setUTCHours(23, 59, 59, 999);

  return {
    from_date: start.toISOString().replace('T', ' ').substring(0, 19),
    to_date: end.toISOString().replace('T', ' ').substring(0, 19),
  };
};

export { get24Range };
