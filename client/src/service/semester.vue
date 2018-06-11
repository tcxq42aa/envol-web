<script>
    import axios from 'axios'
    const instance = axios.create({
        baseURL: '/',
        timeout: 6000
    });

    export const getSemesterDetail = (semesterId) => {
        return instance.get('api/semester/detail?semesterId=' + semesterId)
    }
</script>
