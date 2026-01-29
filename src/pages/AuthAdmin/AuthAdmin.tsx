import { useState, type FormEvent } from "react";
import Button from "../../components/Button/Button";
import Headling from "../../components/Headling/Headling";
import Input from "../../components/Input/Input";
import styles from './AuthAdmin.module.css';
import  { type LoginForm } from "../../interfaces/LoginForm.interface";
import { PREFIX } from "../../helpers/API";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export function AuthAdmin() {
    const [error, setError] = useState<string | null>()
    const navigate = useNavigate();

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null)
        const target = e.target as typeof  e.target & LoginForm;
        const { login, password } = target;
        console.log(login.value, password.value);
        await sendLogin(login.value, password.value);
    }

    const sendLogin = async (login: string, password: string) => {
        try {
        const res = await axios.post(`${PREFIX}/login`, {
            login,
            password
        });
        if (!res.data.success) {
            setError(res.data.error);
        } else {
            navigate('/admin/cabinet')
        }
        console.log(res.data.error);
        } catch (e) {
            console.error(e)
        }
    }   

    return <div className={styles.auth}>
            <div className={styles.head}>
                <Headling appearence="admin" >авторизация</Headling>
            </div>
            {error && <div className={styles.error}>{error}</div>}
            <form className={styles.form} onSubmit={submit}>
                <div className={styles.field}>
                    <label htmlFor="email">E-mail</label>
                    <Input id="email" name="login" type="email" placeholder="example@domain.xyz" />
                </div>
                <div className={styles.field}>
                    <label htmlFor="password">Пароль</label>
                    <Input id="password" type="password" name="password" placeholder="Ваш пароль" />
                </div>                
                <div className={styles.button}>
                    <Button appereance='admin'>авторизоваться</Button>
                </div>                
            </form>           
        </div>
    }