const delay = (time = 1000) => new Promise((resolve) => setTimeout(resolve, time));

const doWithRetry = async (method: () => any, retries = 5, delayMs = 1000) => {
  for (let current = 0; current < retries; current++) {
    console.log("going to call method with try ", current);
    try {
      await method();
      break;
    } catch (err) {
      console.log("failed to call method", err);
      await delay(delayMs);
    }
  }
};

export default doWithRetry;
