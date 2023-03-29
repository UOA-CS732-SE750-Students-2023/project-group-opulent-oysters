import { Form } from "../../components/Form";
import styles from "./LandingPage.module.css";
import styled from "styled-components";

export function LandingPage() {
  return (
    <div className={styles.container}>
      <h1>Karaokify</h1>

      <Form></Form>
    </div>
  );
}
