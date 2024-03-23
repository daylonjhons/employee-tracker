INSERT INTO department (name)
VALUES ("engineering"),
       ("sales"),
       ("finance"),
       ("legal");


INSERT INTO role (title, salary, department_id)
VALUES ("lead engineer", 150000, 1),
       ("software engineer", 120000, 1),
       ("sales lead", 100000, 2),
       ("salesperson", 80000, 2),
       ("account manager", 160000, 3),
       ("accountant", 125000, 3),
       ("legal team lead", 250000, 4),
       ("lawyer", 190000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("emily", "smith", 1, NULL),
       ("jacob", "johnson", 2, 1),
       ("brooklyn", "williams", 3, NULL),
       ("ethan", "brown", 4, 3),
       ("carl", "jones", 5, NULL),
       ("noah", "davis", 6, 5),
       ("olivia", "miller", 7, NULL),
       ("william", "wilson", 8, 7);
