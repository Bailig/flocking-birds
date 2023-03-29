rm -rf dist;

# build react variations
cd react;

export VITE_BIRD_TYPE=curry;
pnpm build;
mkdir -p ../dist/$VITE_BIRD_TYPE; 
mv dist/* ../dist/$VITE_BIRD_TYPE;

export VITE_BIRD_TYPE=immutable;
pnpm build;
mkdir -p ../dist/$VITE_BIRD_TYPE;
mv dist/* ../dist/$VITE_BIRD_TYPE;

export VITE_BIRD_TYPE=mutable;
pnpm build;
mkdir -p ../dist/$VITE_BIRD_TYPE;
mv dist/* ../dist/$VITE_BIRD_TYPE;

cd ..;

# build solid
cd solid;
pnpm build;
mkdir -p ../dist/solid; 
mv dist/* ../dist/solid;