import styles from './index.module.css';

import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className={styles.about}>
        <h1>sdfsdfsdf</h1>
        <p>sdfsdfsdfsdfsdf</p>
        <Link to="/" className='btn'>Salvar Tarefa</Link>
    </div>
  )
}

export default About