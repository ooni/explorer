export const axiosResponseTime = (instance) => {
  instance.interceptors.request.use((request) => {
    request.startTime = Date.now()
    return request
  })

  instance.interceptors.response.use((response) => {
    const loadTime = Date.now() - response.config.startTime
    response.loadTime = loadTime
    return response
  })
}

/*
https://stackoverflow.com/questions/62186171/measure-network-latency-in-react-native/62257712#62257712
const axiosTiming = (instance) => {
  instance.interceptors.request.use((request) => {
    request.ts = Date.now();
    return request;
  });

  instance.interceptors.response.use((response) => {
    const timeInMs = `${Number(Date.now() - response.config.ts).toFixed()}ms`;
    response.latency = timeInMs;
    return response;
  });
};
axiosTiming(axios);



node_modules/axios-time/src/

module.exports = function (instance) {
    instance.interceptors.request.use(function (request) {
        request.timingStart = Date.now();
        return request;
    });

    instance.interceptors.response.use(function (response) {
        response.timings = getResponseTimingData(response);

        return response;
    }, function (error) {
        if (error.response){
            error.response.timings = getResponseTimingData(error.response);
        };

        return Promise.reject(error);
    });
};

const getResponseTimingData = (response) => {
    const timingStart = response.config.timingStart;
    const timingEnd = Date.now();
    const elapsedTime = calcElapsedTime(timingStart, timingEnd);

    return {
        timingEnd,
        timingStart,
        elapsedTime,
    };
};

const calcElapsedTime = (timingStart, timingEnd) => {
    if (timingStart && timingEnd) {
        return Math.round(timingEnd - timingStart);
    }

    return;
};


*/
