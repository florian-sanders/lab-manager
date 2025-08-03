{
  description = "Lab Manager development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_24
            postgresql_15
          ];

          shellHook = ''
            # PostgreSQL setup
            export PGDATA=$PWD/postgres_data
            export PGHOST=$PWD/postgres
            export PGPORT=5433
            export PGDATABASE=lab_manager
            
            # Create socket directory
            mkdir -p $PGHOST
            
            # Initialize database if needed
            if [ ! -d $PGDATA ]; then
              echo "Initializing PostgreSQL database..."
              initdb --auth=trust --no-locale --encoding=UTF8
            fi
            
            # Start PostgreSQL if not already running
            if ! pg_ctl status -D $PGDATA >/dev/null 2>&1; then
              echo "Starting PostgreSQL on port $PGPORT..."
              pg_ctl start -D $PGDATA -l $PWD/postgres.log -o "-k $PGHOST -p $PGPORT"
            else
              echo "PostgreSQL already running"
            fi
            
            echo ""
            echo "Lab Manager development environment"
            echo "Node.js version: $(node --version)"
            echo "npm version: $(npm --version)"
            echo "PostgreSQL version: $(postgres --version)"
            echo "PostgreSQL running on port $PGPORT"
            echo ""
            echo "Database setup commands:"
            echo "  createdb -h localhost -p $PGPORT lab_manager"
            echo "  psql -h localhost -p $PGPORT -d lab_manager -c \"CREATE USER lab_manager_user WITH PASSWORD 'dev_password';\""
            echo "  psql -h localhost -p $PGPORT -d lab_manager -c \"GRANT ALL PRIVILEGES ON DATABASE lab_manager TO lab_manager_user;\""
            echo ""
            echo "Connect to database:"
            echo "  psql -h localhost -p $PGPORT -d lab_manager"
            echo ""
            echo "Available commands:"
            echo "  npm install     # Install dependencies"
            echo "  npm run dev     # Start development servers"
            echo "  npm run build   # Build both packages"
            echo "  npm run test    # Run tests"
            echo "  npm run lint    # Run linting"
          '';
        };
      });
}