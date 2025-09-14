import axios from "axios";

export const getCepInfo = async (req, res) => {
  try {
    const { cep } = req.params;
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

    if (response.data.erro) {
      return res.status(404).json({ error: "CEP não encontrado." });
    }

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: "Falha ao consultar o CEP.", details: error.message });
  }
};
