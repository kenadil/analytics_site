import * as Yup from "yup";

const RecordSchema = Yup.object().shape({
    name: Yup.string().required("Cannot be empty!"),
    email: Yup.string().email("Invalid email").required("Cannot be empty!"),
    category: Yup.string().required("Cannot be empty!"),
});

export const ChangeCategorySchema = Yup.object().shape({ 
    category: Yup.string().required("Cannot be empty!"),
});

export default RecordSchema;