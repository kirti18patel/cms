INSERT INTO department (name)
VALUES
  ('Sales'),
  ('Engineering'),
  ('Finance'),
  ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES
  ('Sales Lead', 100000, 1),
  ('Sales Person', 60000, 1),
  ('Software Engineer', 80000 , 2),
  ('Front End Developer', 70000 ,2),
  ('QA Analyst', 60000, 2),
  ('Accountant',120000,3),
  ('Financial Advisor', 100000, 3),
  ('Lawyer', 900000, 4),
  ('Legal Team Lead', 130000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('John', 'Doe', 1 , NULL),
  ('Carolina', 'Smith', 2, 1),
  ('Maryam', 'Abdul', 2 , 1),
  ('Livitha', 'Wuvais', 2 , 1),
  ('Ekisha', 'John', 3 , NULL),
  ('Leon', 'Williams', 4 , NULL),
  ('Ellie', 'Akl', 4 , NULL),
  ('Jeremy', 'Peter', 5 , 3),
  ('Rachel', 'Marta', 5 , 3),
  ('Simran', 'Kaur', 6 , NULL),
  ('Lisa', 'Ray', 7 , NULL),
  ('Indila', 'Dube', 8 , 9),
  ('Poria', 'Clarke', 9 , NULL);