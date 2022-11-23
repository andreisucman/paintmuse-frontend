import { useState, useEffect } from "react";
import styles from "../../styles/components/common/Counter.module.scss";
import { useGetMethods } from "./ContextProvider";

export default function Counter() {
  const { setImageCount } = useGetMethods();
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (!setImageCount) return;
    setImageCount(count);
  }, [count, setImageCount]);

  function handleCount(argument) {
    switch (argument) {
      case "increment":
        if (count + 1 > 10) return;
        setCount((prevValue) => prevValue + 1);
        break;
      case "decrement":
        if (count - 1 < 3) return;
        setCount((prevValue) => prevValue - 1);
        break;
      default:
        return;
    }
  }

  return (
    <div className={styles.counter}>
      <button
        className={`${styles.counter__button} ${styles.counter__button_increment}`}
        onClick={() => handleCount("decrement")}
      >
        -
      </button>
      <input
        type="number"
        className={`${styles.counter__field}`}
        value={count}
        disabled={true}
      />
      <button
        className={`${styles.counter__button} ${styles.counter__button_decrement}`}
        onClick={() => handleCount("increment")}
      >
        +
      </button>
    </div>
  );
}
