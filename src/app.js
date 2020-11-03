const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const validateRepositoryIsValid = (request, response, next) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).send({ message: "Invalid ID" });
  }

  const repositoryIndex = repositories.findIndex(repository => {
    return repository.id === id;
  });

  if (repositoryIndex === -1) {
    return response.status(400).send({ error: 'Repository not found.' });
  }

  return next();
};

app.use('/repositories/:id', validateRepositoryIsValid);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  if (!title || !url || !techs) {
    return response.status(400).send({
      message: 'Error create new repository'
    });
  }

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);
  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repositoryIndex = repositories.findIndex(repository => {
    return repository.id === id;
  });

  const repository = repositories[repositoryIndex];

  const updatedRepository = {
    id,
    title,
    url,
    techs,
    likes: repository.likes
  };

  repositories[repositoryIndex] = updatedRepository

  return response.json(updatedRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => {
    return repository.id === id;
  });

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => {
    return repository.id === id;
  });

  const updatedRepository = repositories[repositoryIndex];

  updatedRepository.likes += 1;

  repositories[repositoryIndex] = updatedRepository

  return response.json(updatedRepository);
});

module.exports = app;