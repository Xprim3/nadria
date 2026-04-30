insert into public.review (restaurant_id, quote, name, detail, is_active, sort_order)
select
  r.id,
  seed.quote,
  seed.name,
  seed.detail,
  true,
  seed.sort_order
from public.restaurant r
cross join (
  values
    (1, 'Excellent pizza and very friendly team. We will definitely come back.', 'Daniel K.', 'Dinner guest'),
    (2, 'Beautiful atmosphere, fresh pasta, and quick service even when it was busy.', 'Laura M.', 'Weekend visit'),
    (3, 'Great quality for the price. The seafood pasta was full of flavour.', 'Thomas R.', 'Evening meal'),
    (4, 'Family-friendly place with warm hospitality and authentic Italian food.', 'Mina S.', 'Family dinner'),
    (5, 'Pickup order was ready on time and still hot. Very reliable service.', 'Patrick L.', 'Pickup customer'),
    (6, 'We celebrated a birthday here and everything was perfect from start to finish.', 'Sofia B.', 'Group reservation'),
    (7, 'Crispy base, quality ingredients, and one of the best pizzas in the area.', 'Marco D.', 'Pizza lover'),
    (8, 'Clean restaurant, welcoming staff, and consistently tasty dishes.', 'Nina H.', 'Regular guest')
) as seed(sort_order, quote, name, detail)
where not exists (
  select 1
  from public.review rv
  where rv.restaurant_id = r.id
);
