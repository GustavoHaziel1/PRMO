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
-- 👤 Usuários
CREATE TABLE usuarios (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 📖 Atualização da tabela termos
ALTER TABLE termos
ADD COLUMN usuario_id INTEGER;

-- 🔗 Relacionamento com usuários
ALTER TABLE termos
ADD CONSTRAINT fk_termos_usuario
FOREIGN KEY (usuario_id)
REFERENCES usuarios(id)
ON DELETE CASCADE;

-- 📝 Documentação
COMMENT ON TABLE usuarios IS '👤 Armazena os usuários cadastrados';

COMMENT ON COLUMN usuarios.email IS '📧 Email de acesso do usuário';
COMMENT ON COLUMN usuarios.senha IS '🔐 Senha do usuário (preparada para hash bcrypt)';

COMMENT ON COLUMN termos.usuario_id IS '👤 Identificador do usuário proprietário do termo';