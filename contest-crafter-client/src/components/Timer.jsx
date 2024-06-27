import { useEffect, useState } from "react";

const Timer = ({ deadline }) => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  
  useEffect(() => {
    const countdown = setInterval(() => {
      const now = new Date().getTime();
      const deadlineD = new Date(deadline).getTime();
      const distance = deadlineD - now;
        // console.log(distance);

      setDays(Math.floor(distance / (1000 * 60 * 60 * 24)));

      setHours(
        Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      );
      setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
      setSeconds(Math.floor((distance % (1000 * 60)) / 1000));

      //   console.log(days, hours, minutes, seconds);

      if (distance < 0) {
        clearInterval(countdown);
        setIsExpired(true);
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [deadline]);

  if (isExpired) {
    return <h1 className="text-2xl font-bold text-center">Not Available</h1>;
  }
  return (
    <div className="myCountDown grid grid-flow-col gap-5 text-center auto-cols-max">
      <div className="flex flex-col">
        <span className="countdown font-mono text-5xl">
          <span style={{ "--value": days }}></span>
        </span>
        days
      </div>
      <div className="flex flex-col">
        <span className="countdown font-mono text-5xl">
          <span style={{ "--value": hours }}></span>
        </span>
        hours
      </div>
      <div className="flex flex-col">
        <span className="countdown font-mono text-5xl">
          <span style={{ "--value": minutes }}></span>
        </span>
        min
      </div>
      <div className="flex flex-col">
        <span className="countdown font-mono text-5xl">
          <span style={{ "--value": seconds }}></span>
        </span>
        sec
      </div>
    </div>
  );
};

export default Timer;
