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
            postgresql
          ];

          shellHook = ''
            echo "Lab Manager development environment"
            echo "Node.js version: $(node --version)"
            echo "npm version: $(npm --version)"
            echo "PostgreSQL version: $(postgres --version)"
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