import { Link } from "react-router";
import FormMetrics from "../../components/metrics/form/Form";
import classes from "./Metrics.style.module.css";
import { Button } from "@mantine/core";

const MetricsPage = () => {
  return (
    <section
      className={
        classes.hero +
        " " +
        "h-full flex items-center mx-auto justify-items-center flex-col"
      }
    >
      <Link to="/">
        <Button className="my-4" variant="gradient" size="xl" radius="xl">
          Regresar Al Home!
        </Button>
      </Link>
      <FormMetrics></FormMetrics>
    </section>
  );
};

export default MetricsPage;
