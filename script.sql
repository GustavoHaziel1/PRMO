-- 📖 Dicionário de termos
CREATE TABLE termos (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tipo VARCHAR(100) NOT NULL,
    significado TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 📝 Documentação da tabela
COMMENT ON TABLE termos IS '📖 Armazena os termos e seus respectivos significados';

COMMENT ON COLUMN termos.id IS '🆔 Identificador único e automático';
COMMENT ON COLUMN termos.tipo IS '🔤 Palavra ou termo pesquisável';
COMMENT ON COLUMN termos.significado IS '📚 Definição ou significado do termo';
COMMENT ON COLUMN termos.criado_em IS '📅 Data de cadastro do termo';